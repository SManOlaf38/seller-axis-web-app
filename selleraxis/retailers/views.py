import asyncio

from asgiref.sync import async_to_sync, sync_to_async
from django.conf import settings
from django.db.models import OuterRef, Subquery
from django.http import Http404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    DestroyAPIView,
    GenericAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.views import APIView

from selleraxis.addresses.models import Address
from selleraxis.core.clients.boto3_client import s3_client
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_queue_histories.models import RetailerQueueHistory
from selleraxis.retailers.models import Retailer
from selleraxis.retailers.serializers import (
    CreateQBORetailerSerializer,
    CreateRetailerSerializer,
    ReadRetailerSerializer,
    RetailerCheckOrderSerializer,
    RetailerSerializer,
    UpdateRetailerSerializer,
    XMLRetailerSerializer,
)
from selleraxis.retailers.services.import_data import import_purchase_order
from selleraxis.retailers.services.inventory_xml_handler import InventoryXMLHandler

from ..core.custom_permission import CustomPermission
from ..organizations.models import Organization
from .exceptions import InventoryXMLS3UploadException, InventoryXMLSFTPUploadException
from .services.retailer_qbo_services import (
    create_quickbook_retailer_service,
    update_quickbook_retailer_service,
)


class ListCreateRetailerView(ListCreateAPIView):
    model = Retailer
    serializer_class = RetailerSerializer
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["name", "created_at"]
    search_fields = ["name"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerSerializer
        return CreateRetailerSerializer

    def get_queryset(self):
        retailer_queue_history_subquery = (
            RetailerQueueHistory.objects.filter(
                label=RetailerQueueHistory.Label.INVENTORY, retailer=OuterRef("id")
            )
            .order_by("-created_at")
            .values("result_url")[:1]
        )

        retailer = self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        ).annotate(result_url=Subquery(retailer_queue_history_subquery))
        return retailer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER)
            case _:
                return check_permission(self, Permissions.CREATE_RETAILER)

    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        address_data = validated_data.pop("ship_from_address", None)
        address = Address.objects.create(
            **address_data,
            organization_id=self.request.headers.get("organization"),
        )
        sftp_data = validated_data.pop("retailer_sftp", None)
        retailer = Retailer.objects.create(
            **validated_data,
            organization_id=self.request.headers.get("organization"),
            ship_from_address_id=address.id,
        )
        RetailerCommercehubSFTP.objects.create(**sftp_data, retailer_id=retailer.id)


class UpdateDeleteRetailerView(RetrieveUpdateDestroyAPIView):
    model = Retailer
    serializer_class = RetailerSerializer
    lookup_field = "id"
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerSerializer
        return UpdateRetailerSerializer

    def get_queryset(self):
        retailer_queue_history_subquery = (
            RetailerQueueHistory.objects.filter(
                label=RetailerQueueHistory.Label.INVENTORY, retailer=OuterRef("id")
            )
            .order_by("-created_at")
            .values("result_url")[:1]
        )

        retailer = self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        ).annotate(result_url=Subquery(retailer_queue_history_subquery))
        return retailer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_RETAILER)
            case _:
                return check_permission(self, Permissions.UPDATE_RETAILER)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def perform_update(self, serializer):
        validated_data = serializer.validated_data
        retailer_id = self.kwargs.get("id")
        try:
            retailer = Retailer.objects.get(id=retailer_id)
        except Retailer.DoesNotExist:
            raise Http404
        if "retailer_sftp" in validated_data:
            RetailerCommercehubSFTP.objects.filter(retailer_id=retailer_id).update(
                **validated_data.pop("retailer_sftp")
            )
        if "ship_from_address" in validated_data:
            Address.objects.filter(id=retailer.ship_from_address.id).update(
                **validated_data.pop("ship_from_address")
            )
        serializer.save()


class BulkRetailerView(DestroyAPIView):
    model = Retailer
    lookup_field = "id"
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        return check_permission(self, Permissions.DELETE_RETAILER)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            )
        ]
    )
    def delete(self, request, *args, **kwargs):
        organization_id = self.request.headers.get("organization")
        ids = request.query_params.get("ids")
        Retailer.objects.filter(
            id__in=ids.split(","), organization=organization_id
        ).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class ImportDataPurchaseOrderView(RetrieveAPIView):
    model = Retailer
    serializer_class = RetailerSerializer
    lookup_field = "id"
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        import_purchase_order(instance)
        return Response("Succeed")

    def check_permissions(self, _):
        return check_permission(self, Permissions.IMPORT_RETAILER_PURCHASE_ORDER)


class RetailerInventoryXML(RetrieveAPIView):
    serializer_class = XMLRetailerSerializer
    lookup_field = "id"
    queryset = Retailer.objects.all()
    permission_classes = [CustomPermission]

    def get_queryset(self):
        retailer_queue_history_subquery = (
            RetailerQueueHistory.objects.filter(
                label=RetailerQueueHistory.Label.INVENTORY, retailer=OuterRef("id")
            )
            .order_by("-created_at")
            .values("result_url")[:1]
        )

        retailer = self.queryset.annotate(
            result_url=Subquery(retailer_queue_history_subquery)
        )
        return retailer

    def retrieve(self, request, *args, **kwargs):
        retailer = self.get_object()
        queue_history_obj = self.create_queue_history(retailer=retailer)
        response_data = self.create_inventory(
            retailer=retailer, queue_history_obj=queue_history_obj
        )
        return Response(data=response_data, status=HTTP_200_OK)

    def create_queue_history(self, retailer: Retailer) -> RetailerQueueHistory:
        return RetailerQueueHistory.objects.create(
            retailer_id=retailer.pk,
            type=retailer.type,
            status=RetailerQueueHistory.Status.PENDING,
            label=RetailerQueueHistory.Label.INVENTORY,
        )

    def create_inventory(
        self, retailer: Retailer, queue_history_obj: RetailerQueueHistory
    ) -> dict:
        serializer = self.serializer_class(retailer)
        inventory_obj = InventoryXMLHandler(data=serializer.data)
        file, file_created = inventory_obj.upload_xml_file(False)
        if file_created:
            s3_response = s3_client.upload_file(
                filename=inventory_obj.localpath, bucket=settings.BUCKET_NAME
            )
            # remove XML file on localhost path
            inventory_obj.remove_xml_file_localpath()
            if s3_response.ok:
                queue_history_obj.status = RetailerQueueHistory.Status.COMPLETED
                queue_history_obj.result_url = s3_response.data
                queue_history_obj.save()
            else:
                queue_history_obj.status = RetailerQueueHistory.Status.FAILED
                queue_history_obj.save()
                raise InventoryXMLS3UploadException

            return {"id": retailer.pk, "file": s3_response.data}

        queue_history_obj.status = RetailerQueueHistory.Status.FAILED
        queue_history_obj.save()
        raise InventoryXMLSFTPUploadException


class RetailerCheckOrder(RetrieveAPIView):
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = RetailerCheckOrderSerializer

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return (
            self.queryset.filter(organization_id=organization_id)
            .prefetch_related("retailer_order_batch")
            .select_related("retailer_commercehub_sftp")
        )


class RetailerSQSInventoryXMLView(GenericAPIView):
    serializer_class = XMLRetailerSerializer
    lookup_field = "id"
    queryset = Retailer.objects.all()
    permission_classes = [CustomPermission]

    def get_queryset(self):
        retailer_queue_history_subquery = (
            RetailerQueueHistory.objects.filter(
                label=RetailerQueueHistory.Label.INVENTORY, retailer=OuterRef("id")
            )
            .order_by("-created_at")
            .values("result_url")[:1]
        )

        retailer = self.queryset.annotate(
            result_url=Subquery(retailer_queue_history_subquery)
        )
        return retailer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "product_alias_ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            )
        ]
    )
    def get(self, request, *args, **kwargs):
        ids = request.query_params.get("product_alias_ids")
        ids = [int(item) for item in ids.split(",")]
        retailer = self.get_object()
        queue_history_obj = self.create_queue_history_retailer(retailer=retailer)
        response_data = self.create_inventory_retailer(
            retailer=retailer, queue_history_obj=queue_history_obj, ids=ids
        )
        return Response(data=response_data, status=HTTP_200_OK)

    def create_queue_history_retailer(self, retailer: Retailer) -> RetailerQueueHistory:
        return RetailerQueueHistory.objects.create(
            retailer_id=retailer.pk,
            type=retailer.type,
            status=RetailerQueueHistory.Status.PENDING,
            label=RetailerQueueHistory.Label.INVENTORY,
        )

    def create_inventory_retailer(
        self, retailer: Retailer, queue_history_obj: RetailerQueueHistory, ids: list
    ) -> dict:
        serializer = self.serializer_class(retailer)
        data = serializer.data
        filtered_aliases = [
            alias for alias in data["retailer_products_aliases"] if alias["id"] in ids
        ]
        data["retailer_products_aliases"] = filtered_aliases
        inventory_obj = InventoryXMLHandler(data=data)
        file, file_created = inventory_obj.upload_xml_file(False)
        if file_created:
            s3_response = s3_client.upload_file(
                filename=inventory_obj.localpath, bucket=settings.BUCKET_NAME
            )
            # remove XML file on localhost path
            inventory_obj.remove_xml_file_localpath()
            if s3_response.ok:
                queue_history_obj.status = RetailerQueueHistory.Status.COMPLETED
                queue_history_obj.result_url = s3_response.data
                queue_history_obj.save()
            else:
                queue_history_obj.status = RetailerQueueHistory.Status.FAILED
                queue_history_obj.save()
                raise InventoryXMLS3UploadException

            return {"id": retailer.pk, "file": s3_response.data}

        queue_history_obj.status = RetailerQueueHistory.Status.FAILED
        queue_history_obj.save()
        raise InventoryXMLSFTPUploadException


class QuickbookCreateRetailer(GenericAPIView):
    permission_classes = [CustomPermission]

    def post(self, request, *args, **kwargs):
        serializer = CreateQBORetailerSerializer(data=request.data)
        if serializer.is_valid():
            retailer_to_qbo = Retailer.objects.filter(
                id=serializer.validated_data.get("object_id")
            ).first()
            if retailer_to_qbo is None:
                raise ParseError("Retailer not found")
            response = create_quickbook_retailer_service(
                action=serializer.validated_data.get("action"),
                model=serializer.validated_data.get("model"),
                retailer_to_qbo=retailer_to_qbo,
                is_sandbox=serializer.validated_data.get("is_sandbox"),
            )
            return Response(data={"data": response}, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuickbookUpdateRetailer(GenericAPIView):
    permission_classes = [CustomPermission]

    def patch(self, request, *args, **kwargs):
        serializer = CreateQBORetailerSerializer(data=request.data)
        if serializer.is_valid():
            retailer_to_qbo = Retailer.objects.filter(
                id=serializer.validated_data.get("object_id")
            ).first()
            if retailer_to_qbo is None:
                raise ParseError("Retailer not found")
            response = update_quickbook_retailer_service(
                action=serializer.validated_data.get("action"),
                model=serializer.validated_data.get("model"),
                retailer_to_qbo=retailer_to_qbo,
                is_sandbox=serializer.validated_data.get("is_sandbox"),
            )
            return Response(data={"data": response}, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCreateRetailerQBOView(QuickbookCreateRetailer, QuickbookUpdateRetailer):
    serializer_class = CreateQBORetailerSerializer


class ManualCreateRetailerQBOView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        organization_id = self.request.headers.get("organization")
        organization = Organization.objects.filter(id=organization_id).first()
        retailer_id = self.kwargs.get("id")
        retailer_to_qbo = Retailer.objects.filter(id=retailer_id).first()
        if retailer_to_qbo is None:
            raise ParseError("Retailer not found")
        response_item = {
            "id": retailer_id,
            "name": retailer_to_qbo.name,
            "qbo_id": None,
            "create_qbo_message": "Success",
        }
        try:
            response = create_quickbook_retailer_service(
                action="Create",
                model="Retailer",
                retailer_to_qbo=retailer_to_qbo,
                is_sandbox=organization.is_sandbox,
            )
            response_item["qbo_id"] = response.get("qbo_id")
        except Exception as e:
            response_item["create_qbo_message"] = e.detail
            return Response(
                data={
                    "data": f'Retailer {response_item.get("name")} create QBO fail'
                    f', error: {response_item.get("create_qbo_message")}'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return_response = {"qbo_customer_ref_id": response_item.get("qbo_id")}
        return Response(
            data={"data": return_response},
            status=status.HTTP_200_OK,
        )


class BulkManualCreateRetailerQBOView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        organization_id = self.request.headers.get("organization")
        organization = Organization.objects.filter(id=organization_id).first()
        retailer_ids = request.query_params.get("ids").split(",")
        list_retailer = Retailer.objects.filter(
            id__in=retailer_ids, organization_id=organization_id
        )
        list_response = []
        for retailer_id in retailer_ids:
            found_id = False
            for retailer_to_qbo in list_retailer:
                if int(retailer_id) == int(retailer_to_qbo.id):
                    found_id = True
                    break
            if not found_id:
                response_item = {
                    "id": retailer_id,
                    "name": None,
                    "qbo_id": None,
                    "create_qbo_message": "Not found",
                }
                list_response.append(response_item)
        res = self.bulk_create_retailer_qbo_process(list_retailer, organization)
        list_response += res
        return Response(data=list_response, status=status.HTTP_200_OK)

    @async_to_sync
    async def bulk_create_retailer_qbo_process(self, list_retailer, organization):
        response = await asyncio.gather(
            *[self.create_QBO(retailer, organization) for retailer in list_retailer]
        )
        return response

    @sync_to_async
    def create_QBO(self, retailer_to_qbo, organization):
        response_item = {
            "id": retailer_to_qbo.id,
            "name": retailer_to_qbo.name,
            "qbo_id": None,
            "create_qbo_message": "Success",
        }
        try:
            response = create_quickbook_retailer_service(
                action="Create",
                model="Retailer",
                retailer_to_qbo=retailer_to_qbo,
                is_sandbox=organization.is_sandbox,
            )
            response_item["qbo_id"] = response.get("qbo_id")
        except Exception as e:
            response_item["create_qbo_message"] = e.detail
        return response_item
