from django.conf import settings
from django.db.models import OuterRef, Subquery
from django.forms import model_to_dict
from django.http import Http404
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK

from selleraxis.addresses.models import Address
from selleraxis.core.clients.boto3_client import s3_client
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_queue_histories.models import RetailerQueueHistory
from selleraxis.retailers.models import Retailer
from selleraxis.retailers.serializers import (
    CreateUpdateRetailerSerializer,
    ReadRetailerSerializer,
    RetailerCheckOrderSerializer,
    RetailerSerializer,
    XMLRetailerSerializer,
)
from selleraxis.retailers.services.import_data import import_purchase_order
from selleraxis.retailers.services.inventory_xml_handler import InventoryXMLHandler

from .exceptions import InventoryXMLS3UploadException, InventoryXMLSFTPUploadException


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
        return CreateUpdateRetailerSerializer

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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer_data = serializer.data
        address_data = serializer_data.pop("ship_from_address", None)
        address = Address.objects.create(
            **address_data,
            organization_id=request.headers.get("organization"),
        )

        sftp_data = serializer_data.pop("retailer_sftp", None)
        retailer = Retailer.objects.create(
            name=serializer_data["name"],
            type=serializer_data["type"],
            merchant_id=serializer_data["merchant_id"],
            qbo_customer_ref_id=serializer_data["qbo_customer_ref_id"],
            default_warehouse_id=serializer_data["default_warehouse"],
            default_carrier_id=serializer_data["default_carrier"],
            default_gs1_id=serializer_data["default_gs1"],
            organization_id=request.headers.get("organization"),
            ship_from_address_id=address.id,
        )
        RetailerCommercehubSFTP.objects.create(**sftp_data, retailer_id=retailer.id)
        return Response(model_to_dict(retailer), status=status.HTTP_201_CREATED)


class UpdateDeleteRetailerView(RetrieveUpdateDestroyAPIView):
    model = Retailer
    serializer_class = RetailerSerializer
    lookup_field = "id"
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerSerializer
        return CreateUpdateRetailerSerializer

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

    def perform_update(self, serializer):
        validated_data = serializer.validated_data
        retailer_id = self.kwargs.get("id")
        try:
            retailer = Retailer.objects.get(id=retailer_id)
        except Retailer.DoesNotExist:
            raise Http404
        retailer_sftp = validated_data.pop("retailer_sftp", None)
        ship_from_address = validated_data.pop("ship_from_address", None)
        RetailerCommercehubSFTP.objects.filter(retailer_id=retailer_id).update(
            **retailer_sftp
        )
        Address.objects.filter(id=retailer.ship_from_address.id).update(
            **ship_from_address
        )
        retailer.name = validated_data["name"]
        retailer.type = validated_data["type"]
        retailer.merchant_id = validated_data["merchant_id"]
        retailer.qbo_customer_ref_id = validated_data["qbo_customer_ref_id"]
        if validated_data["default_warehouse"] is not None:
            retailer.default_warehouse_id = validated_data["default_warehouse"]
        else:
            retailer.default_warehouse_id = None
        if validated_data["default_carrier"] is not None:
            retailer.default_carrier_id = validated_data["default_carrier"]
        else:
            retailer.default_carrier_id = None
        if validated_data["default_gs1"] is not None:
            retailer.default_gs1_id = validated_data["default_gs1"]
        else:
            retailer.default_gs1_id = None
        retailer.vendor_id = validated_data["vendor_id"]
        retailer.save()


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
    permission_classes = [AllowAny]

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
