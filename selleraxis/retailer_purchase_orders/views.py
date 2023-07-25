from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.retailer_purchase_orders.serializers import (
    ReadRetailerPurchaseOrderSerializer,
    RetailerPurchaseOrderAcknowledgeSerializer,
    RetailerPurchaseOrderSerializer,
)
from selleraxis.retailer_purchase_orders.services.acknowledge_xml_handler import (
    AcknowledgeXMLHandler,
)


class ListCreateRetailerPurchaseOrderView(ListCreateAPIView):
    model = RetailerPurchaseOrder
    queryset = RetailerPurchaseOrder.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["retailer_purchase_order_id", "created_at"]
    search_fields = ["retailer_purchase_order_id"]
    filterset_fields = ["batch", "batch__retailer"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderSerializer
        else:
            return RetailerPurchaseOrderSerializer

    def get_queryset(self):
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
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
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
        )

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


class RetailerPurchaseOrderAcknowledgeView(CreateAPIView):
    queryset = RetailerPurchaseOrder.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = RetailerPurchaseOrderAcknowledgeSerializer
    allowed_methods = ("POST",)

    def get_queryset(self):
        return self.queryset.filter(pk=self.request.data.get("order_id"))

    def post(self, request, *args, **kwargs):
        try:
            instance = RetailerPurchaseOrder.objects.get(
                pk=self.request.data.get("order_id")
            )
            serializer = ReadRetailerPurchaseOrderSerializer(instance)
            acknowledge_handlers = AcknowledgeXMLHandler(data=serializer.data)
            file, created = acknowledge_handlers.upload_xml_file()
            if created:
                return Response(status=HTTP_204_NO_CONTENT)
        except RetailerPurchaseOrder.DoesNotExist:
            raise ValidationError("Could not found order id")

        raise ValidationError("Could not upload Acknowledge XML file to SFTP.")
