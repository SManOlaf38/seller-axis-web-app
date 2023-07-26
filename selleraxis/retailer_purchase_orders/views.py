from django.db.models import Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.organizations.models import Organization
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.retailer_purchase_orders.serializers import (
    OrganizationPurchaseOrderCheckSerializer,
    OrganizationPurchaseOrderImportSerializer,
    ReadRetailerPurchaseOrderSerializer,
    RetailerPurchaseOrderSerializer,
)
from selleraxis.retailers.models import Retailer

from .services.acknowledge_xml_handler import AcknowledgeXMLHandler


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


class RetailerPurchaseOrderAcknowledgeCreateAPIView(CreateAPIView):
    queryset = RetailerPurchaseOrder.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.queryset.get(pk=self.kwargs.get("pk"))

    def get_queryset(self):
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
        )

    def post(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = ReadRetailerPurchaseOrderSerializer(instance)
            ack_obj = AcknowledgeXMLHandler(data=serializer.data)
            file, file_created = ack_obj.upload_xml_file()
            if file_created:
                return Response(status=HTTP_204_NO_CONTENT)

        except RetailerPurchaseOrder.DoesNotExist:
            raise ValidationError("Purchase order does not exist.")

        except Exception:
            pass

        raise ValidationError("Could not create Acknowledge XML file to SFTP.")


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
                queryset=Retailer.objects.select_related("retailer_commercehub_sftp"),
            )
        )


class OrganizationPurchaseOrderCheckView(OrganizationPurchaseOrderRetrieveAPIView):
    serializer_class = OrganizationPurchaseOrderCheckSerializer


class OrganizationPurchaseOrderImportView(OrganizationPurchaseOrderRetrieveAPIView):
    serializer_class = OrganizationPurchaseOrderImportSerializer
