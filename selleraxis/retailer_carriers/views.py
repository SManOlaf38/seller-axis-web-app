from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    DestroyAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailer_carriers.serializers import (
    ReadRetailerCarrierSerializer,
    RetailerCarrierSerializer,
)


class ListCreateRetailerCarrierView(ListCreateAPIView):
    model = RetailerCarrier
    serializer_class = RetailerCarrierSerializer
    queryset = RetailerCarrier.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]

    ordering_fields = ["service", "created_at"]
    search_fields = ["service__name", "shipper__name", "account_number"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerCarrierSerializer
        return RetailerCarrierSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_CARRIER)
            case _:
                return check_permission(self, Permissions.CREATE_RETAILER_CARRIER)

    def perform_create(self, serializer):
        return serializer.save(organization_id=self.request.headers.get("organization"))

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return (
            self.queryset.filter(organization_id=organization_id)
            .select_related(
                "service", "organization", "shipper", "default_service_type"
            )
            .prefetch_related("service__shipping_ref_service")
        )


class UpdateDeleteRetailerCarrierView(RetrieveUpdateDestroyAPIView):
    serializer_class = RetailerCarrierSerializer
    lookup_field = "id"
    queryset = RetailerCarrier.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerCarrierSerializer
        return RetailerCarrierSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_CARRIER)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_RETAILER_CARRIER)
            case _:
                return check_permission(self, Permissions.UPDATE_RETAILER_CARRIER)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        if self.request.method == "GET":
            return (
                self.queryset.filter(organization_id=organization_id)
                .select_related(
                    "service", "organization", "shipper", "default_service_type"
                )
                .prefetch_related("service__shipping_ref_service")
            )

        return self.queryset.filter(organization_id=organization_id)


class BulkRetailerCarrierView(DestroyAPIView):
    model = RetailerCarrier
    lookup_field = "id"
    queryset = RetailerCarrier.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        return check_permission(self, Permissions.DELETE_RETAILER_CARRIER)

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
        RetailerCarrier.objects.filter(
            id__in=ids.split(","), organization=organization_id
        ).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
