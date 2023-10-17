import asyncio
import base64
import copy
import datetime
import uuid
from typing import List

import boto3
import requests
from asgiref.sync import async_to_sync, sync_to_async
from django.conf import settings
from django.db.models import Count, F, Prefetch
from django.forms import model_to_dict
from django.utils.dateparse import parse_date, parse_datetime
from django.utils.timezone import get_default_timezone
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import APIException, ParseError, ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    CreateAPIView,
    GenericAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
    get_object_or_404,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED
from rest_framework.views import APIView

from selleraxis.core.clients.boto3_client import s3_client
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.organizations.models import Organization
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.models import Product
from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_orders.models import (
    QueueStatus,
    RetailerPurchaseOrder,
)
from selleraxis.retailer_purchase_orders.serializers import (
    BackorderInputSerializer,
    CustomReadRetailerPurchaseOrderSerializer,
    CustomRetailerPurchaseOrderCancelSerializer,
    DailyPicklistSerializer,
    OrganizationPurchaseOrderCheckSerializer,
    OrganizationPurchaseOrderImportSerializer,
    ReadRetailerPurchaseOrderSerializer,
    RetailerPurchaseOrderAcknowledgeSerializer,
    RetailerPurchaseOrderBackorderSerializer,
    RetailerPurchaseOrderCancelSerializer,
    RetailerPurchaseOrderConfirmationSerializer,
    RetailerPurchaseOrderSerializer,
    ShipFromAddressSerializer,
    ShippingBulkSerializer,
    ShippingSerializer,
    ShipToAddressValidationModelSerializer,
)
from selleraxis.retailer_queue_histories.models import RetailerQueueHistory
from selleraxis.retailers.models import Retailer
from selleraxis.service_api.models import ServiceAPI, ServiceAPIAction
from selleraxis.shipments.models import Shipment, ShipmentStatus
from selleraxis.shipping_service_types.models import ShippingServiceType

from ..addresses.models import Address
from ..retailer_purchase_order_histories.models import RetailerPurchaseOrderHistory
from .exceptions import (
    AddressValidationFailed,
    CarrierNotFound,
    CarrierShipperNotFound,
    DailyPicklistInvalidDate,
    OrderPackageNotFound,
    S3UploadException,
    ServiceAPILoginFailed,
    ServiceAPIRequestFailed,
    ShipmentCancelShipped,
    ShippingExists,
    ShippingServiceTypeNotFound,
    XMLSFTPUploadException,
)
from .services.acknowledge_xml_handler import AcknowledgeXMLHandler
from .services.backorder_xml_handler import BackorderXMLHandler
from .services.cancel_xml_handler import CancelXMLHandler
from .services.confirmation_xml_handler import ConfirmationXMLHandler
from .services.services import package_divide_service


class ListCreateRetailerPurchaseOrderView(ListCreateAPIView):
    model = RetailerPurchaseOrder
    queryset = RetailerPurchaseOrder.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = [
        "po_number",
        "customer__name",
        "cust_order_number",
        "batch__retailer__name",
        "verified_ship_to__status",
        "status",
        "order_date",
        "batch__retailer__name",
        "bill_to__name",
    ]
    search_fields = [
        "po_number",
        "customer__name",
        "cust_order_number",
        "bill_to__name",
    ]
    filterset_fields = ["status", "batch__retailer__name"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderSerializer
        else:
            return RetailerPurchaseOrderSerializer

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_from",
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
            )
            .prefetch_related("items")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PURCHASE_ORDER)
            case _:
                return check_permission(
                    self, Permissions.CREATE_RETAILER_PURCHASE_ORDER
                )


class UpdateDeleteRetailerPurchaseOrderView(RetrieveUpdateDestroyAPIView):
    model = RetailerPurchaseOrder
    lookup_field = "id"
    queryset = RetailerPurchaseOrder.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderSerializer
        else:
            return RetailerPurchaseOrderSerializer

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_from",
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
            )
            .prefetch_related("items")
        )

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        items = instance.items.all()
        mappings = {item.merchant_sku: item for item in items}
        product_aliases = ProductAlias.objects.filter(
            merchant_sku__in=mappings.keys(),
            retailer_id=instance.batch.retailer_id,
        )
        for product_alias in product_aliases:
            if mappings.get(product_alias.merchant_sku):
                mappings[product_alias.merchant_sku].product_alias = product_alias
        error_message = None
        package_divide_data = package_divide_service(
            reset=False,
            retailer_purchase_order=instance,
            retailer_id=instance.batch.retailer_id,
        )
        serializer = CustomReadRetailerPurchaseOrderSerializer(instance)

        # add status history of order
        status_history = []
        order_history = []
        for order_history_item in instance.order_history.all():
            history_item = {
                "order_status": order_history_item.status,
                "queue_history_status": order_history_item.queue_history.status,
                "result_url": order_history_item.queue_history.result_url,
            }
            order_history.append(history_item)
            if order_history_item.status not in status_history:
                status_history.append(order_history_item.status)

        result = serializer.data
        # list all status for fe handle
        result["status_history"] = status_history
        # list order history with xml url
        result["order_history"] = order_history

        # update package divide result
        if package_divide_data.get("status") != 200:
            error_data = package_divide_data.get("data")
            error_message = error_data.get("message")
        else:
            for order_package_item in result.get("order_packages"):
                for divide_data in package_divide_data.get("data"):
                    if order_package_item.get("id") == divide_data.get(
                        "order_package_id"
                    ):
                        order_package_item["box_max_quantity"] = divide_data.get(
                            "max_quantity"
                        )
        for order_package_item in result.get("order_packages"):
            remain = order_package_item.get("box_max_quantity", 0)
            if remain > 0:
                for order_item in order_package_item.get("order_item_packages"):
                    remain = remain - order_item.get("quantity") * order_item.get(
                        "retailer_purchase_order_item"
                    ).get("product_alias").get("sku_quantity")
            order_package_item["remain"] = remain
        result.get("order_packages").sort(key=lambda x: x["remain"], reverse=False)
        if error_message:
            result["package_divide_error"] = error_message

        return Response(data=result, status=status.HTTP_200_OK)

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PURCHASE_ORDER)
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_RETAILER_PURCHASE_ORDER
                )
            case _:
                return check_permission(
                    self, Permissions.UPDATE_RETAILER_PURCHASE_ORDER
                )


class RetailerPurchaseOrderXMLAPIView(GenericAPIView):
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
                "ship_from",
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

    def create_queue_history(
        self, order: RetailerPurchaseOrder, label: str
    ) -> RetailerQueueHistory:
        return RetailerQueueHistory.objects.create(
            retailer_id=order.batch.retailer.id,
            type=order.batch.retailer.type,
            status=RetailerQueueHistory.Status.PENDING,
            label=RetailerQueueHistory.Label.ACKNOWLEDGMENT,
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


class RetailerPurchaseOrderAcknowledgeCreateAPIView(RetailerPurchaseOrderXMLAPIView):
    def post(self, request, pk, *args, **kwargs):
        order = get_object_or_404(self.get_queryset(), id=pk)
        queue_history_obj = self.create_queue_history(
            order=order, label=RetailerQueueHistory.Label.ACKNOWLEDGMENT
        )
        response_data = self.create_acknowledge(
            order=order, queue_history_obj=queue_history_obj
        )
        if response_data["status"] == RetailerQueueHistory.Status.COMPLETED.value:
            order.status = QueueStatus.Acknowledged.value
            order.save()
            # create order history
            new_order_history = RetailerPurchaseOrderHistory(
                status=order.status,
                order_id=order.id,
                queue_history_id=queue_history_obj.id,
            )
            new_order_history.save()

        return Response(data=response_data, status=status.HTTP_200_OK)

    def create_acknowledge(
        self, order: RetailerPurchaseOrder, queue_history_obj: RetailerQueueHistory
    ) -> dict:
        serializer_order = RetailerPurchaseOrderAcknowledgeSerializer(order)
        ack_obj = AcknowledgeXMLHandler(data=serializer_order.data)
        file, file_created = ack_obj.upload_xml_file(False)
        sftp_id = ack_obj.commercehub_sftp.id
        retailer_id = ack_obj.commercehub_sftp.retailer_id

        error = XMLSFTPUploadException()
        response_data = {
            "id": order.pk,
            "po_number": order.po_number,
            "sftp_id": sftp_id,
            "retailer_id": retailer_id,
            "status": RetailerQueueHistory.Status.COMPLETED.value,
        }
        if file_created:
            s3_file = self.upload_to_s3(
                handler_obj=ack_obj, queue_history_obj=queue_history_obj
            )
            if s3_file:
                data = {"id": order.pk, "file": s3_file}
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


class RetailerPurchaseOrderBackorderCreateAPIView(RetailerPurchaseOrderXMLAPIView):
    serializer_class = BackorderInputSerializer

    def post(self, request, pk, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            order = get_object_or_404(self.get_queryset(), id=pk)
            order.estimated_ship_date = serializer.validated_data.get(
                "estimated_ship_date"
            )
            order.estimated_delivery_date = serializer.validated_data.get(
                "estimated_delivery_date"
            )
            order.save()
            queue_history_obj = self.create_queue_history(
                order=order, label=RetailerQueueHistory.Label.BACKORDER
            )
            response_data = self.create_backorder(
                order=order, queue_history_obj=queue_history_obj
            )
            if response_data["status"] == RetailerQueueHistory.Status.COMPLETED.value:
                order.status = QueueStatus.Backorder.value
                order.save()
                # create order history
                new_order_history = RetailerPurchaseOrderHistory(
                    status=order.status,
                    order_id=order.id,
                    queue_history_id=queue_history_obj.id,
                )
                new_order_history.save()

            return Response(data=response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create_backorder(
        self, order: RetailerPurchaseOrder, queue_history_obj: RetailerQueueHistory
    ) -> dict:
        serializer_order = RetailerPurchaseOrderBackorderSerializer(order)
        ack_obj = BackorderXMLHandler(data=serializer_order.data)
        file, file_created = ack_obj.upload_xml_file(False)
        sftp_id = ack_obj.commercehub_sftp.id
        retailer_id = ack_obj.commercehub_sftp.retailer_id

        error = XMLSFTPUploadException()
        response_data = {
            "id": order.pk,
            "po_number": order.po_number,
            "sftp_id": sftp_id,
            "retailer_id": retailer_id,
            "status": RetailerQueueHistory.Status.COMPLETED.value,
        }
        if file_created:
            s3_file = self.upload_to_s3(
                handler_obj=ack_obj, queue_history_obj=queue_history_obj
            )
            if s3_file:
                data = {"id": order.pk, "file": s3_file}
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


class RetailerPurchaseOrderAcknowledgeBulkCreateAPIView(
    RetailerPurchaseOrderAcknowledgeCreateAPIView
):
    pass

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "retailer_purchase_order_ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            ),
        ]
    )
    def post(self, request, *args, **kwargs):
        purchase_order_ids = request.query_params.get(
            "retailer_purchase_order_ids", None
        )
        if purchase_order_ids:
            purchase_order_ids = purchase_order_ids.split(",")

        purchase_orders = (
            RetailerPurchaseOrder.objects.filter(
                pk__in=purchase_order_ids,
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                ),
            )
            .select_related(
                "ship_from",
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

        if len(purchase_order_ids) != purchase_orders.count():
            raise ParseError("Purchase order ids doesn't match!")

        responses = self.bulk_create(purchase_orders=list(purchase_orders))
        return Response(data=responses, status=HTTP_201_CREATED)

    @async_to_sync
    async def bulk_create(
        self, purchase_orders: List[RetailerPurchaseOrder]
    ) -> List[dict]:
        tasks = []
        for purchase_order in purchase_orders:
            tasks.append(sync_to_async(self.create_task)(purchase_order))

        responses = await asyncio.gather(*tasks, return_exceptions=True)
        return responses

    def create_task(self, purchase_order: RetailerPurchaseOrder) -> dict:
        queue_history_obj = self.create_queue_history(
            order=purchase_order, label=RetailerQueueHistory.Label.ACKNOWLEDGMENT
        )
        response_data = self.create_acknowledge(purchase_order, queue_history_obj)
        if response_data["status"] == RetailerQueueHistory.Status.COMPLETED.value:
            purchase_order.status = QueueStatus.Acknowledged.value
            purchase_order.save()
            # create order history
            new_order_history = RetailerPurchaseOrderHistory(
                status=purchase_order.status,
                order_id=purchase_order.id,
                queue_history_id=queue_history_obj.id,
            )
            new_order_history.save()

        return response_data


class RetailerPurchaseOrderShipmentConfirmationCreateAPIView(
    RetailerPurchaseOrderXMLAPIView
):
    def post(self, request, pk, *args, **kwargs):
        order = get_object_or_404(self.get_queryset(), id=pk)
        queue_history_obj = self.create_queue_history(
            order=order, label=RetailerQueueHistory.Label.CONFIRM
        )
        response_data = self.create_shipment_confirmation(
            order=order, queue_history_obj=queue_history_obj
        )

        return Response(data=response_data, status=status.HTTP_200_OK)

    def create_shipment_confirmation(
        self, order: RetailerPurchaseOrder, queue_history_obj: RetailerQueueHistory
    ) -> dict:
        serializer_order = RetailerPurchaseOrderConfirmationSerializer(order)
        shipment_obj = ConfirmationXMLHandler(data=serializer_order.data)
        file, file_created = shipment_obj.upload_xml_file(False)
        if file_created:
            s3_file = self.upload_to_s3(
                handler_obj=shipment_obj, queue_history_obj=queue_history_obj
            )
            if not s3_file:
                raise S3UploadException
            order.status = QueueStatus.Shipment_Confirmed.value
            order.save()
            # create order history
            new_order_history = RetailerPurchaseOrderHistory(
                status=order.status,
                order_id=order.id,
                queue_history_id=queue_history_obj.id,
            )
            new_order_history.save()

            return {"id": order.pk, "file": s3_file}

        self.update_queue_history(queue_history_obj, RetailerQueueHistory.Status.FAILED)
        raise XMLSFTPUploadException


class RetailerPurchaseOrderShipmentCancelCreateAPIView(RetailerPurchaseOrderXMLAPIView):
    def get_serializer_class(self):
        return CustomRetailerPurchaseOrderCancelSerializer

    def post(self, request, pk, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        objs = []
        for item in serializer.data:
            obj = RetailerPurchaseOrderItem.objects.get(id=item["id_item"])
            obj.cancel_reason = item["reason"]
            obj.qty_ordered = item["qty"]
            objs.append(obj)
        RetailerPurchaseOrderItem.objects.bulk_update(
            objs, ["cancel_reason", "qty_ordered"]
        )
        order = get_object_or_404(self.get_queryset(), id=pk)
        if order.status == QueueStatus.Shipped:
            raise ShipmentCancelShipped
        queue_history_obj = self.create_queue_history(
            order=order, label=RetailerQueueHistory.Label.CONFIRM
        )
        response_data = self.create_cancel(
            order=order, queue_history_obj=queue_history_obj
        )

        return Response(data=response_data, status=status.HTTP_200_OK)

    def create_cancel(
        self, order: RetailerPurchaseOrder, queue_history_obj: RetailerQueueHistory
    ) -> dict:
        serializer_order = RetailerPurchaseOrderCancelSerializer(order)
        cancel_obj = CancelXMLHandler(data=serializer_order.data)
        file, file_created = cancel_obj.upload_xml_file(False)
        if file_created:
            s3_file = self.upload_to_s3(
                handler_obj=cancel_obj, queue_history_obj=queue_history_obj
            )
            if not s3_file:
                raise S3UploadException
            order.status = QueueStatus.Cancelled.value
            order.save()
            # create order history
            new_order_history = RetailerPurchaseOrderHistory(
                status=order.status,
                order_id=order.id,
                queue_history_id=queue_history_obj.id,
            )
            new_order_history.save()

            return {"id": order.pk, "file": s3_file}

        self.update_queue_history(queue_history_obj, RetailerQueueHistory.Status.FAILED)
        raise XMLSFTPUploadException


class OrganizationPurchaseOrderRetrieveAPIView(RetrieveAPIView):
    queryset = Organization.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.get_queryset().get()

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(pk=organization_id).prefetch_related(
            Prefetch(
                "retailer_organization",
                queryset=Retailer.objects.prefetch_related(
                    "retailer_order_batch"
                ).select_related("retailer_commercehub_sftp"),
            )
        )


class OrganizationPurchaseOrderCheckView(OrganizationPurchaseOrderRetrieveAPIView):
    serializer_class = OrganizationPurchaseOrderCheckSerializer


class OrganizationPurchaseOrderImportView(OrganizationPurchaseOrderRetrieveAPIView):
    serializer_class = OrganizationPurchaseOrderImportSerializer


class PackageDivideResetView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderSerializer

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_from",
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
            )
            .prefetch_related("items")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "POST":
                return check_permission(self, Permissions.PACKAGE_DIVIDE)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        items = instance.items.all()
        mappings = {item.merchant_sku: item for item in items}
        product_aliases = ProductAlias.objects.filter(
            merchant_sku__in=mappings.keys(),
            retailer_id=instance.batch.retailer_id,
        )
        for product_alias in product_aliases:
            if mappings.get(product_alias.merchant_sku):
                mappings[product_alias.merchant_sku].product_alias = product_alias
        error_message = None
        package_divide_data = package_divide_service(
            reset=True,
            retailer_purchase_order=instance,
            retailer_id=instance.batch.retailer_id,
        )
        serializer = CustomReadRetailerPurchaseOrderSerializer(instance)

        result = serializer.data
        if package_divide_data.get("status") != 200:
            error_data = package_divide_data.get("data")
            error_message = error_data.get("message")
        else:
            for order_package_item in result.get("order_packages"):
                for divide_data in package_divide_data.get("data"):
                    if order_package_item.get("id") == divide_data.get(
                        "order_package_id"
                    ):
                        order_package_item["box_max_quantity"] = divide_data.get(
                            "max_quantity"
                        )
        for order_package_item in result.get("order_packages"):
            remain = order_package_item.get("box_max_quantity", 0)
            if remain > 0:
                for order_item in order_package_item.get("order_item_packages"):
                    remain = remain - order_item.get("quantity") * order_item.get(
                        "retailer_purchase_order_item"
                    ).get("product_alias").get("sku_quantity")
            order_package_item["remain"] = remain
        result.get("order_packages").sort(key=lambda x: x["remain"], reverse=False)
        if error_message:
            result["package_divide_error"] = error_message

        return Response(data=result, status=status.HTTP_200_OK)


class ShipFromAddressView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()
    serializer_class = ShipFromAddressSerializer

    def get_queryset(self):
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
        ).select_related("ship_from")

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.update_or_create(serializer)

    def update_or_create(self, serializer):
        order = self.get_object()
        instance = order.ship_from
        action_status = str(serializer.validated_data["status"]).upper()
        if action_status == Address.Status.ORIGIN.value:
            self.revert_ship_from(order=order)
        else:
            for field, value in serializer.validated_data.items():
                if field in serializer.validated_data:
                    serializer.validated_data[field] = value

                if instance and hasattr(instance, field):
                    setattr(instance, field, value)

            if isinstance(instance, Address):
                instance.company = serializer.validated_data["company"]
                instance.contact_name = serializer.validated_data["contact_name"]
                instance.save()
            else:
                instance = serializer.save()
                order.ship_from = instance
                order.save()

        return Response(data=model_to_dict(order.ship_from), status=HTTP_201_CREATED)

    @staticmethod
    def revert_ship_from(order: RetailerPurchaseOrder) -> None:
        if not order.batch.retailer.ship_from_address:
            raise ValidationError(
                "Not found the default ship from address information."
            )
        ship_from_address = order.batch.retailer.ship_from_address
        write_fields = {
            key: value
            for key, value in ship_from_address.__dict__.items()
            if hasattr(Address, key)
        }
        write_fields.pop("id")
        Address.objects.filter(id=order.ship_from.id).update(**write_fields)


class ShipToAddressValidationView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()
    serializer_class = ShipToAddressValidationModelSerializer

    def get_queryset(self):
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
        ).select_related("verified_ship_to")

    def check_permissions(self, _):
        return check_permission(self, Permissions.VALIDATE_ADDRESS)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action_status = str(serializer.validated_data["status"]).upper()
        if action_status in [
            serializer.Meta.model.Status.ORIGIN.value,
            serializer.Meta.model.Status.EDITED.value,
        ]:
            return self.revert_or_edit(
                serializer=serializer, action_status=action_status
            )

        organization_id = self.request.headers.get("organization")
        carrier_id = serializer.validated_data["carrier_id"]
        carrier = RetailerCarrier.objects.filter(
            organization_id=organization_id, pk=carrier_id
        ).last()

        verified_ship_to = self.create_verified_address(
            verified_address=serializer.validated_data,
            purchase_order=self.get_object(),
            carrier=carrier,
        )
        return Response(data=model_to_dict(verified_ship_to), status=HTTP_201_CREATED)

    @staticmethod
    def create_verified_address(
        verified_address: dict,
        purchase_order: RetailerPurchaseOrder,
        carrier: RetailerCarrier,
    ) -> Address:
        if carrier is None:
            ShipToAddressValidationView.update_status_verified_address(
                purchase_order.verified_ship_to,
                Address.Status.FAILED.value,
            )
            raise CarrierNotFound

        origin_string = f"{carrier.client_id}:{carrier.client_secret}"
        to_binary = origin_string.encode("UTF-8")
        basic_auth = (base64.b64encode(to_binary)).decode("ascii")

        login_api = ServiceAPI.objects.filter(
            service_id=carrier.service, action=ServiceAPIAction.LOGIN
        ).first()

        try:
            login_response = login_api.request(
                {
                    "client_id": carrier.client_id,
                    "client_secret": carrier.client_secret,
                    "basic_auth": basic_auth,
                }
            )
        except KeyError:
            ShipToAddressValidationView.update_status_verified_address(
                purchase_order.verified_ship_to,
                Address.Status.FAILED.value,
            )
            raise ServiceAPILoginFailed

        address_validation_data = copy.deepcopy(verified_address)
        address_validation_data["access_token"] = login_response["access_token"]

        address_validation_api = ServiceAPI.objects.filter(
            service_id=carrier.service, action=ServiceAPIAction.ADDRESS_VALIDATION
        ).first()

        try:
            address_validation_response = address_validation_api.request(
                address_validation_data
            )
            if "city" in address_validation_response:
                address_validation_response.pop("city")
        except KeyError:
            ShipToAddressValidationView.update_status_verified_address(
                purchase_order.verified_ship_to,
                Address.Status.FAILED.value,
            )
            raise AddressValidationFailed

        except Exception as e:
            ShipToAddressValidationView.update_status_verified_address(
                purchase_order.verified_ship_to,
                Address.Status.FAILED.value,
            )
            if isinstance(e, APIException):
                raise e

            raise AddressValidationFailed

        if (
            "address_1" not in address_validation_response
            and str(address_validation_response.get("status")).lower() != "success"
        ):
            ShipToAddressValidationView.update_status_verified_address(
                purchase_order.verified_ship_to,
                Address.Status.FAILED.value,
            )
            raise AddressValidationFailed

        instance = purchase_order.verified_ship_to

        # keep original city
        address_validation_response["status"] = Address.Status.VERIFIED
        if "city" in address_validation_response:
            address_validation_response.pop("city")

        for field, value in address_validation_response.items():
            if field in verified_address:
                verified_address[field] = value

            if hasattr(instance, field):
                setattr(instance, field, value)

        if isinstance(instance, Address):
            instance.company = verified_address.get("company")
            instance.contact_name = verified_address.get("contact_name")
        else:
            write_fields = {
                k: v for k, v in verified_address.items() if hasattr(Address, k)
            }
            instance = Address(**write_fields)

        instance.save()
        purchase_order.verified_ship_to = instance
        purchase_order.carrier = carrier
        purchase_order.save()
        return instance

    def revert_or_edit(self, serializer, action_status: str):
        order = self.get_object()
        instance = order.verified_ship_to
        if not isinstance(instance, Address):
            instance = serializer.save()
        else:
            if action_status == serializer.Meta.model.Status.ORIGIN.value:
                instance = self.ship_to_2_verified_ship_to(order.ship_to, instance)
                instance.status = action_status
            else:
                for field, value in serializer.validated_data.items():
                    if instance and hasattr(instance, field):
                        setattr(instance, field, value)

            instance.save()

        order.verified_ship_to = instance
        order.save()
        return Response(data=model_to_dict(order.verified_ship_to), status=HTTP_200_OK)

    @staticmethod
    def ship_to_2_verified_ship_to(ship_to, verified_ship_to: Address) -> Address:
        verified_ship_to.company = ship_to.company
        verified_ship_to.contact_name = ship_to.name
        verified_ship_to.address_1 = ship_to.address_1
        verified_ship_to.address_2 = ship_to.address_2
        verified_ship_to.city = ship_to.city
        verified_ship_to.state = ship_to.state
        verified_ship_to.country = ship_to.country
        verified_ship_to.postal_code = ship_to.postal_code
        verified_ship_to.phone = ship_to.day_phone
        return verified_ship_to

    @staticmethod
    def update_status_verified_address(
        obj: Address = None,
        update_status: str = Address.Status.FAILED.value,
    ) -> None:
        if isinstance(obj, Address):
            obj.status = update_status
            obj.save()


class ShipToAddressValidationBulkCreateAPIView(ShipToAddressValidationView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "retailer_purchase_order_ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            ),
        ]
    )
    def post(self, request, *args, **kwargs):
        purchase_order_ids = self.request.query_params.get(
            "retailer_purchase_order_ids", None
        )
        if purchase_order_ids:
            purchase_order_ids = purchase_order_ids.split(",")

        purchase_orders = RetailerPurchaseOrder.objects.filter(
            pk__in=purchase_order_ids,
            batch__retailer__organization_id=self.request.headers.get("organization"),
        ).select_related(
            "ship_to", "verified_ship_to", "batch__retailer__default_carrier"
        )

        tasks = []
        for purchase_order in purchase_orders:
            if isinstance(purchase_order.verified_ship_to, Address):
                verified_ship_to = purchase_order.verified_ship_to
            else:
                verified_ship_to = (
                    ShipToAddressValidationView.ship_to_2_verified_ship_to(
                        purchase_order.ship_to,
                        Address(status=Address.Status.ORIGIN),
                    )
                )

                verified_ship_to.save()
                purchase_order.verified_ship_to = verified_ship_to
                purchase_order.save()

            tasks.append(
                sync_to_async(ShipToAddressValidationView.create_verified_address)(
                    model_to_dict(purchase_order.verified_ship_to),
                    purchase_order,
                    purchase_order.batch.retailer.default_carrier,
                )
            )

        responses = self.bulk_create(tasks=tasks)
        response_data = []
        for i, response in enumerate(responses):
            data = {
                "id": purchase_orders[i].pk,
                "po_number": purchase_orders[i].po_number,
                "status": "COMPLETED",
            }
            if isinstance(response, Address):
                data["data"] = model_to_dict(response)
            else:
                data["status"] = "FAILED"
                data["data"] = {
                    "error": {
                        "default_code": response.default_code,
                        "status_code": response.status_code,
                        "detail": response.detail,
                    }
                }
            response_data.append(data)

        return Response(data=response_data, status=HTTP_201_CREATED)

    @async_to_sync
    async def bulk_create(self, tasks) -> List[dict]:
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        return responses


class ShippingView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()
    serializer_class = ReadRetailerPurchaseOrderSerializer()

    def get_serializer(self, *args, **kwargs):
        return ShippingSerializer(*args, **kwargs)

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_from",
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

    def check_permissions(self, _):
        return check_permission(self, Permissions.CREATE_SHIPPING)

    def post(self, request, pk, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = get_object_or_404(self.get_queryset(), id=pk)
        return self.create_shipping(order=order, serializer=serializer)

    def create_shipping(
        self, order: RetailerPurchaseOrder, serializer: ShippingSerializer
    ):
        order.carrier = serializer.validated_data.get("carrier")
        order.shipping_service = serializer.validated_data.get("shipping_service")
        order.shipping_ref_1 = serializer.validated_data.get("shipping_ref_1")
        order.shipping_ref_2 = serializer.validated_data.get("shipping_ref_2")
        order.shipping_ref_3 = serializer.validated_data.get("shipping_ref_3")
        order.shipping_ref_4 = serializer.validated_data.get("shipping_ref_4")
        order.shipping_ref_5 = serializer.validated_data.get("shipping_ref_5")
        order.gs1 = serializer.validated_data.get("gs1")

        if order.verified_ship_to is None:
            verified_ship_to = ShipToAddressValidationView.ship_to_2_verified_ship_to(
                order.ship_to,
                Address(status=Address.Status.ORIGIN),
            )
            verified_ship_to.save()
            order.verified_ship_to = verified_ship_to

        order.save()
        serializer_order = ReadRetailerPurchaseOrderSerializer(order)
        if order.status == QueueStatus.Shipped.value:
            raise ShippingExists

        if len(serializer_order.data["order_packages"]) == 0:
            raise OrderPackageNotFound

        if serializer_order.data["carrier"]["shipper"] is None:
            raise CarrierShipperNotFound

        if order.carrier is None:
            raise CarrierNotFound

        if order.verified_ship_to.status != Address.Status.VERIFIED:
            try:
                ShipToAddressValidationView.create_verified_address(
                    verified_address=model_to_dict(order.verified_ship_to),
                    purchase_order=order,
                    carrier=order.carrier,
                )
            except Exception:
                pass

        origin_string = f"{order.carrier.client_id}:{order.carrier.client_secret}"
        to_binary = origin_string.encode("UTF-8")
        basic_auth = (base64.b64encode(to_binary)).decode("ascii")

        login_api = ServiceAPI.objects.filter(
            service_id=order.carrier.service, action=ServiceAPIAction.LOGIN
        ).first()

        try:
            login_response = login_api.request(
                {
                    "client_id": order.carrier.client_id,
                    "client_secret": order.carrier.client_secret,
                    "basic_auth": basic_auth,
                }
            )
        except KeyError:
            raise ServiceAPILoginFailed

        try:
            shipping_service_type = ShippingServiceType.objects.get(
                code=order.shipping_service, service=order.carrier.service
            )
        except ShippingServiceType.DoesNotExist:
            raise ShippingServiceTypeNotFound

        shipping_data = ReadRetailerPurchaseOrderSerializer(order).data
        shipping_data["access_token"] = login_response["access_token"]
        shipping_data["datetime"] = datetime

        shipping_api = ServiceAPI.objects.filter(
            service_id=order.carrier.service, action=ServiceAPIAction.SHIPPING
        ).first()

        try:
            shipping_response = shipping_api.request(shipping_data)
        except KeyError:
            raise ServiceAPIRequestFailed

        shipment_list = self.create_shipment(
            serializer=serializer_order,
            purchase_order=order,
            shipping_response=shipping_response,
            shipping_service_type=shipping_service_type,
        )
        order.status = QueueStatus.Shipped.value
        order.save()
        return Response(
            data=[model_to_dict(shipment) for shipment in shipment_list],
            status=status.HTTP_200_OK,
        )

    def create_shipment(
        self,
        serializer: ReadRetailerPurchaseOrderSerializer,
        purchase_order: RetailerPurchaseOrder,
        shipping_response,
        shipping_service_type,
    ) -> List:
        sscc_list = None
        if purchase_order.gs1:
            sscc_list = purchase_order.gs1.get_sscc(len(shipping_response["shipments"]))
        if purchase_order.carrier is None:
            raise CarrierNotFound

        shipment_list = []
        for i, shipment in enumerate(shipping_response["shipments"]):
            package_document = shipment["package_document"]
            if shipment["document_type"] == "base64":
                key = (
                    serializer.data["carrier"]["service"]["name"]
                    + "_"
                    + str(uuid.uuid4())
                )
                imgdata = base64.b64decode(shipment["package_document"])
                s3 = boto3.client("s3")
                s3.put_object(
                    Bucket=settings.BUCKET_NAME,
                    Key=key,
                    Body=imgdata,
                    ContentType="image/jpeg",
                )
                package_document = (
                    f"https://{settings.BUCKET_NAME}.s3.amazonaws.com/{key}"
                )
            if shipment["document_type"] == "url":
                key = (
                    serializer.data["carrier"]["service"]["name"]
                    + "_"
                    + str(uuid.uuid4())
                )
                r = requests.get(shipment["package_document"], stream=True)
                session = boto3.Session()
                s3 = session.resource("s3")
                bucket = s3.Bucket(settings.BUCKET_NAME)
                bucket.upload_fileobj(r.raw, key)
                package_document = (
                    f"https://{settings.BUCKET_NAME}.s3.amazonaws.com/{key}"
                )
            shipment_list.append(
                Shipment(
                    status=ShipmentStatus.CREATED,
                    tracking_number=shipment["tracking_number"],
                    package_document=package_document,
                    sscc=sscc_list[i] if sscc_list else None,
                    sender_country=purchase_order.ship_from.country
                    if purchase_order.ship_from
                    else purchase_order.carrier.shipper.country,
                    identification_number=shipping_response["identification_number"]
                    if "identification_number" in shipping_response
                    else "",
                    carrier=purchase_order.carrier,
                    package_id=serializer.data["order_packages"][i]["id"],
                    type=shipping_service_type,
                )
            )
        Shipment.objects.bulk_create(shipment_list)
        return shipment_list


class ShippingBulkCreateAPIView(ShippingView):
    def get_serializer(self, *args, **kwargs):
        return ShippingBulkSerializer(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        if isinstance(request.data, dict):
            serializer = ShippingSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            order = get_object_or_404(self.get_queryset(), id=request.data["id"])
            return self.create_shipping(order=order, serializer=serializer)

        data_serializers = {data["id"]: data for data in request.data if "id" in data}
        purchase_orders = (
            RetailerPurchaseOrder.objects.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                ),
                pk__in=data_serializers.keys(),
            )
            .select_related(
                "ship_from",
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

        if len(request.data) != purchase_orders.count():
            raise ParseError("Purchase order ids doesn't match!")

        errors = {}
        serializers = []
        for purchase_order in purchase_orders:
            data = data_serializers.get(purchase_order.pk)
            serializer = ShippingSerializer(purchase_order, data=data)
            if serializer.is_valid():
                serializers.append(serializer)
            else:
                errors[purchase_order.pk] = {
                    "error": {
                        "default_code": "input_body_invalid",
                        "status_code": 400,
                        "detail": "Unprocessable Entity",
                    }
                }

        responses = self.bulk_create(serializers=serializers)
        data = {}
        for i, response in enumerate(responses):
            if isinstance(response, Response):
                data[serializers[i].instance.pk] = response.data

            elif isinstance(response, APIException):
                data[serializers[i].instance.pk] = {
                    "error": {
                        "default_code": "request_carrier_api_error",
                        "status_code": response.status_code,
                        "detail": response.detail,
                    }
                }
            else:
                data[serializers[i].instance.pk] = {
                    "error": {
                        "default_code": "unknown_error",
                        "status_code": 400,
                        "detail": "Please contact the administrator for more information",
                    }
                }

        if errors:
            data.update(errors)

        response_data = []
        for purchase_order in purchase_orders:
            response = {
                "id": purchase_order.pk,
                "po_number": purchase_order.po_number,
                "data": data[purchase_order.pk],
                "status": "FAILED"
                if "error" in data[purchase_order.pk]
                else "COMPLETED",
            }
            response_data.append(response)
        return Response(data=response_data, status=HTTP_201_CREATED)

    @async_to_sync
    async def bulk_create(self, serializers: List[ShippingSerializer]) -> List[dict]:
        tasks = []
        for serializer in serializers:
            tasks.append(
                sync_to_async(self.create_shipping)(serializer.instance, serializer)
            )

        responses = await asyncio.gather(*tasks, return_exceptions=True)
        return responses


class DailyPicklistAPIView(ListAPIView):
    queryset = RetailerPurchaseOrderItem.objects.all()
    serializer_class = DailyPicklistSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["created_at"]

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        items = self.queryset.filter(
            order__batch__retailer__organization_id=organization_id
        )
        created_at = self.request.query_params.get("created_at")
        if created_at:
            created_at = parse_datetime(created_at) or parse_date(created_at)
            if not isinstance(created_at, (datetime.datetime, datetime.date)):
                raise DailyPicklistInvalidDate
            if isinstance(created_at, datetime.datetime):
                created_at = created_at.astimezone(get_default_timezone()).date()

            created_at_gt = created_at - datetime.timedelta(days=1)
            created_at_lt = created_at + datetime.timedelta(days=1)
            items = items.filter(
                order__order_date__gt=created_at_gt, order__order_date__lt=created_at_lt
            )
        queryset = (
            Product.objects.filter(
                products_aliases__merchant_sku__in=items.values_list(
                    "merchant_sku", flat=True
                ).distinct(),
                products_aliases__retailer__organization_id=organization_id,
            )
            .values(
                product_sku=F("sku"),
                quantity=F("products_aliases__sku_quantity"),
                merchant_sku=F("products_aliases__merchant_sku"),
            )
            .annotate(
                id=F("pk"),
                name=F("quantity"),
                alias_count=Count("product_sku"),
                total_quantity=(F("quantity") * F("alias_count")),
                available_quantity=F("qty_on_hand"),
                product_alias_sku=F("products_aliases__sku"),
                product_alias_id=F("products_aliases__id"),
            )
            .order_by("quantity")
            .distinct()
        )
        return queryset

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "status",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            ),
            # ... add more parameters as needed ...
        ]
    )
    def get(self, request, *args, **kwargs):
        search_status = request.query_params.get("status")
        list_status = []
        if search_status:
            search_status = search_status.upper()
            search_status = search_status.strip()
            if search_status != "":
                list_status = search_status.split(",")
                for idx, value in enumerate(list_status):
                    list_status[idx] = list_status[idx].strip()
        serializers = self.get_serializer(
            self.to_table_data(list_status=list_status), many=True
        )
        return Response(data=serializers.data)

    def to_table_data(self, list_status):
        if len(list_status) == 0:
            list_status = ["SHIPPED"]
        organization_id = self.request.headers.get("organization")
        items = self.queryset.filter(
            order__batch__retailer__organization_id=organization_id
        )
        created_at = self.request.query_params.get("created_at")
        if created_at:
            created_at = parse_datetime(created_at) or parse_date(created_at)
            if not isinstance(created_at, (datetime.datetime, datetime.date)):
                raise DailyPicklistInvalidDate
            if isinstance(created_at, datetime.datetime):
                created_at = created_at.astimezone(get_default_timezone()).date()

            created_at_gt = created_at - datetime.timedelta(days=1)
            created_at_lt = created_at + datetime.timedelta(days=1)
            items = items.filter(
                order__order_date__gt=created_at_gt, order__order_date__lt=created_at_lt
            )

        instances = self.get_queryset()
        hash_instances = {}
        quantities = []
        for instance in instances:
            product_alias_sku = instance.get("product_alias_sku")
            instance.pop("product_alias_sku")
            merchant_sku = instance["merchant_sku"]
            product_sku = instance["product_sku"]
            quantity = instance["quantity"]
            available_quantity = instance["available_quantity"]
            product_alias_id = instance["product_alias_id"]
            instance.pop("product_alias_id")
            instance.pop("available_quantity")
            instance.pop("product_sku")
            data = {"id": instance["id"]}
            # check product_sku exist in list result
            if product_sku not in hash_instances:
                data["product_sku"] = product_sku
                data["group"] = [instance]
                data["available_quantity"] = available_quantity
                data["product_alias_info"] = []
                # create product alias info
                if product_alias_sku is not None:
                    list_quantity = []
                    # only check item have status SHIPPED
                    for item in items:
                        if item.merchant_sku == merchant_sku:
                            if (item.order.status.upper() in list_status) or (
                                "ALL" in list_status
                            ):
                                list_quantity.append(
                                    {
                                        "quantity": item.qty_ordered,
                                        "po_number": item.order.po_number,
                                        "order_id": item.order.id,
                                    }
                                )
                    # append product_alias if found order valid
                    if len(list_quantity) > 0:
                        data.get("product_alias_info").append(
                            {
                                "product_alias_id": product_alias_id,
                                "product_alias_sku": product_alias_sku,
                                "merchant_sku": merchant_sku,
                                "packaging": quantity,
                                "list_quantity": list_quantity,
                            }
                        )
                    # calculate sum of package for each sku quantity
                    for group_item in data["group"]:
                        group_item["count"] = 0
                        for product_alias in data.get("product_alias_info"):
                            if str(group_item.get("name")) == str(
                                product_alias.get("packaging")
                            ):
                                for quantity_item in product_alias.get("list_quantity"):
                                    group_item["count"] += quantity_item.get("quantity")
                # sum of item in all package
                if len(data["product_alias_info"]) > 0:
                    data["quantity"] = 0
                    for group_item in data["group"]:
                        data["quantity"] += group_item.get("count") * int(
                            group_item.get("name")
                        )
                    hash_instances[product_sku] = data
            else:
                add_item = False
                for group_item in hash_instances[product_sku]["group"]:
                    if group_item.get("name") == instance.get("name"):
                        add_item = True
                        group_item["alias_count"] += instance.get("alias_count")
                        group_item["total_quantity"] += instance.get("total_quantity")
                if add_item is False:
                    hash_instances[product_sku]["group"].append(instance)

                if len(hash_instances[product_sku]["product_alias_info"]) > 0:
                    add_info = False
                    # check product alias, if exist update info
                    for product_alias_info in hash_instances[product_sku][
                        "product_alias_info"
                    ]:
                        if (
                            product_alias_info.get("product_alias_sku")
                            == product_alias_sku
                        ):
                            add_info = True
                            for item in items:
                                if item.merchant_sku == merchant_sku:
                                    if (item.order.status.upper() in list_status) or (
                                        "ALL" in list_status
                                    ):
                                        add_quantity = False
                                        for alias_quantity in product_alias_info.get(
                                            "list_quantity"
                                        ):
                                            # check po number, if exist increase quantity
                                            if (
                                                alias_quantity.get("po_number")
                                                == item.order.po_number
                                            ):
                                                add_quantity = True
                                                alias_quantity[
                                                    "quantity"
                                                ] += item.qty_ordered
                                        if add_quantity is False:
                                            # add new po number and quantity
                                            product_alias_info.get(
                                                "list_quantity"
                                            ).append(
                                                {
                                                    "quantity": item.qty_ordered,
                                                    "po_number": item.order.po_number,
                                                    "order_id": item.order.id,
                                                }
                                            )
                    # add new product alias
                    if add_info is False:
                        list_quantity = []
                        # only check item have status SHIPPED
                        for item in items:
                            if item.merchant_sku == merchant_sku:
                                if (item.order.status.upper() in list_status) or (
                                    "ALL" in list_status
                                ):
                                    list_quantity.append(
                                        {
                                            "quantity": item.qty_ordered,
                                            "po_number": item.order.po_number,
                                            "order_id": item.order.id,
                                        }
                                    )
                        # append product_alias if found order valid
                        if len(list_quantity) > 0:
                            new_product_alias = {
                                "product_alias_id": product_alias_id,
                                "product_alias_sku": product_alias_sku,
                                "packaging": quantity,
                                "list_quantity": list_quantity,
                            }
                            hash_instances[product_sku]["product_alias_info"].append(
                                new_product_alias
                            )
                    # calculate sum of package for each sku quantity after update
                    for group_item in hash_instances[product_sku]["group"]:
                        group_item["count"] = 0
                        for product_alias in hash_instances[product_sku][
                            "product_alias_info"
                        ]:
                            if str(group_item.get("name")) == str(
                                product_alias.get("packaging")
                            ):
                                for quantity_item in product_alias.get("list_quantity"):
                                    group_item["count"] += quantity_item.get("quantity")

            if quantity not in quantities:
                quantities.append(quantity)
            # remove group not have valid order
            for key in hash_instances:
                list_group = hash_instances[f"{key}"].get("group")
                list_group = [item for item in list_group if item.get("count") != 0]
                hash_instances[f"{key}"]["group"] = list_group
                # sum of item in all package
                hash_instances[f"{key}"]["quantity"] = 0
                for group_item in list_group:
                    hash_instances[f"{key}"]["quantity"] += group_item.get(
                        "count"
                    ) * int(group_item.get("name"))
        return self.reprocess_table_data(hash_instances, quantities)

    def reprocess_table_data(self, hash_instances, quantities) -> List[dict]:
        new_quantity = []
        for key in hash_instances:
            groups = hash_instances[key]["group"]
            group_quantities = [group["quantity"] for group in groups]
            for quantity in group_quantities:
                if quantity not in new_quantity:
                    new_quantity.append(quantity)

        for key in hash_instances:
            groups = hash_instances[key]["group"]
            group_quantities = [group["quantity"] for group in groups]
            for quantity in new_quantity:
                if quantity not in group_quantities:
                    groups.append(
                        {
                            "name": quantity,
                            "alias_count": 0,
                            "quantity": quantity,
                            "count": 0,
                            "total_quantity": 0,
                        }
                    )
            sorted_groups = sorted(groups, key=lambda x: x["quantity"])
            hash_instances[key]["group"] = sorted_groups
        return hash_instances.values()


class OrderStatusIsBypassedAcknowledge(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "order_ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            )
        ]
    )
    def get(self, request):
        ids = request.query_params.get("order_ids")
        if ids:
            list_id = ids.split(",")
            RetailerPurchaseOrder.objects.filter(id__in=list_id).update(
                status=QueueStatus.Bypassed_Acknowledge.value
            )
        return Response("Order has changed status successfully")
