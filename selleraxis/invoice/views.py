import json

from django.conf import settings
from django.http import HttpResponse
from rest_framework import status
from rest_framework.exceptions import APIException, ParseError
from rest_framework.generics import CreateAPIView, GenericAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from selleraxis.core.clients.boto3_client import s3_client, sqs_client
from selleraxis.invoice.exceptions import InvoiceInvalidException
from selleraxis.invoice.models import Invoice
from selleraxis.invoice.serializers import CodeSerializer
from selleraxis.invoice.services.invoice_xml_handler import InvoiceXMLHandler
from selleraxis.invoice.services.services import (
    create_invoice,
    create_token,
    get_authorization_url,
    save_invoices,
)
from selleraxis.organizations.models import Organization
from selleraxis.qbo_unhandled_data.models import QBOUnhandledData
from selleraxis.retailer_purchase_orders.exceptions import (
    S3UploadException,
    XMLSFTPUploadException,
)
from selleraxis.retailer_purchase_orders.models import (
    QueueStatus,
    RetailerPurchaseOrder,
)
from selleraxis.retailer_purchase_orders.serializers import (
    ReadRetailerPurchaseOrderSerializer,
    RetailerPurchaseOrderAcknowledgeSerializer,
)
from selleraxis.retailer_queue_histories.models import RetailerQueueHistory


class GetQBOAuthorizationURLView(APIView):
    """
    get the code of quick book online
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        return url get code
        """
        organization_id = self.request.headers.get("organization")
        auth_url = get_authorization_url(organization_id)
        return Response(auth_url, status=status.HTTP_200_OK)


class CreateQBOTokenView(CreateAPIView):
    """
    Create token QBO
    """

    permission_classes = [IsAuthenticated]
    serializer_class = CodeSerializer

    def post(self, request, *args, **kwargs):
        organization_id = self.request.headers.get("organization")
        if organization_id is None:
            return Response(
                data={"data": "Missing organization_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            auth_code = serializer.validated_data.get("auth_code")
            realm_id = serializer.validated_data.get("realm_id")
            token = create_token(auth_code, realm_id, organization_id)
            return Response(token, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateInvoiceView(APIView):
    """
    Create invoice
    """

    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
                "carrier",
            )
            .prefetch_related("items")
        )

    def post(self, request, pk, *args, **kwargs):
        organization_id = self.request.headers.get("organization")
        organization = Organization.objects.filter(id=organization_id).first()
        access_token = organization.qbo_access_token
        realm_id = organization.realm_id
        order = get_object_or_404(self.get_queryset(), id=pk)
        serializer_order = ReadRetailerPurchaseOrderSerializer(order)
        data = create_invoice(serializer_order)
        result = save_invoices(organization, access_token, realm_id, data)
        if Invoice.objects.filter(order_id=pk).exists():
            raise InvoiceInvalidException
        Invoice.objects.create(
            doc_number=str(result["Invoice"]["DocNumber"]),
            invoice_id=str(result["Invoice"]["Id"]),
            order=order,
        )
        order.status = QueueStatus.Invoiced.value
        order.save()
        return Response(data=result, status=status.HTTP_200_OK)


class SQSSyncUnhandledDataView(APIView):
    def post(self, request, *args, **kwargs):
        organization = request.headers.get("organization")
        qbo_unhandled_data = QBOUnhandledData.objects.filter(
            organization=organization,
            status__in=[
                QBOUnhandledData.Status.UNHANDLED.value,
                QBOUnhandledData.Status.EXPIRED.value,
            ],
        )
        for item in qbo_unhandled_data:
            if item.model == QBOUnhandledData.Model.PRODUCT.value:
                dict_data = {
                    "action": item.action,
                    "model": item.model,
                    "object_id": item.object_id,
                }
                message_body = json.dumps(dict_data)
                sqs_client.create_queue(
                    message_body=message_body,
                    queue_name=settings.CRUD_PRODUCT_SQS_NAME,
                )
            if item.model == QBOUnhandledData.Model.RETAILER.value:
                dict_data = {
                    "action": item.action,
                    "model": item.model,
                    "object_id": item.object_id,
                }
                message_body = json.dumps(dict_data)
                sqs_client.create_queue(
                    message_body=message_body,
                    queue_name=settings.CRUD_RETAILER_SQS_NAME,
                )
        qbo_unhandled_data.delete()
        return HttpResponse(status=204)


class InvoiceXMLAPIView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Invoice.objects.all()

    def get_queryset(self):
        return self.queryset.filter(
            order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        )

    def create_queue_history(
        self, order: RetailerPurchaseOrder, label: str
    ) -> RetailerQueueHistory:
        return RetailerQueueHistory.objects.create(
            retailer_id=order.batch.retailer.id,
            type=order.batch.retailer.type,
            status=RetailerQueueHistory.Status.PENDING,
            label=RetailerQueueHistory.Label.INVOICE,
        )

    def upload_to_s3(self, handler_obj, queue_history_obj):
        s3_response = s3_client.upload_file(
            filename=handler_obj.localpath, bucket=settings.BUCKET_NAME
        )

        # remove XML file on localhost path
        handler_obj.remove_xml_file_localpath()

        if s3_response.ok:
            self.update_queue_history(
                queue_history_obj,
                RetailerQueueHistory.Status.COMPLETED,
                s3_response.data,
            )
            return s3_response.data

        self.update_queue_history(queue_history_obj, RetailerQueueHistory.Status.FAILED)

    def update_queue_history(
        self, queue_history_obj, history_status: str, result_url=None
    ):
        queue_history_obj.status = history_status
        queue_history_obj.result_url = result_url
        queue_history_obj.save()


class InvoiceCreateXMLAPIView(InvoiceXMLAPIView):
    def post(self, request, pk, *args, **kwargs):
        invoice = get_object_or_404(self.get_queryset(), id=pk)
        order = invoice.order
        queue_history_obj = self.create_queue_history(
            order=order, label=RetailerQueueHistory.Label.INVOICE
        )
        response_data = self.create_invoice(
            order=order, queue_history_obj=queue_history_obj
        )
        if response_data["status"] == RetailerQueueHistory.Status.COMPLETED.value:
            order.status = QueueStatus.Invoice_Confirmed.value
            order.save()
        return Response(data=response_data, status=status.HTTP_200_OK)

    def create_invoice(
        self, order: RetailerPurchaseOrder, queue_history_obj: RetailerQueueHistory
    ) -> dict:
        serializer_order = RetailerPurchaseOrderAcknowledgeSerializer(order)
        if serializer_order.data["batch"]["retailer"]["remit_id"] is None:
            raise ParseError("remit_id of retailer is null!")
        invoice_obj = InvoiceXMLHandler(data=serializer_order.data)
        file, file_created = invoice_obj.upload_xml_file(False)
        sftp_id = invoice_obj.commercehub_sftp.id
        retailer_id = invoice_obj.commercehub_sftp.retailer_id

        error = XMLSFTPUploadException()
        response_data = {
            "id": order.invoice_order.pk,
            "order_id": order.id,
            "po_number": order.po_number,
            "sftp_id": sftp_id,
            "retailer_id": retailer_id,
            "status": RetailerQueueHistory.Status.COMPLETED.value,
        }
        if file_created:
            s3_file = self.upload_to_s3(
                handler_obj=invoice_obj, queue_history_obj=queue_history_obj
            )
            if s3_file:
                data = {"id": order.invoice_order.pk, "file": s3_file}
                response_data["data"] = data
                return response_data

            error = S3UploadException()

        self.update_queue_history(queue_history_obj, RetailerQueueHistory.Status.FAILED)
        if isinstance(file, APIException):
            error = file

        data = {
            "error": {
                "default_code": str(error.default_code),
                "status_code": error.status_code,
                "detail": error.detail,
            }
        }

        response_data["status"] = RetailerQueueHistory.Status.FAILED.value
        response_data["data"] = data
        return response_data
