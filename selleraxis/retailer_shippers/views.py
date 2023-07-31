from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_shippers.models import RetailerShipper
from selleraxis.retailer_shippers.serializers import (
    ReadRetailerShipperSerializer,
    RetailerShipperSerializer,
)


class ListCreateRetailerShipperView(ListCreateAPIView):
    model = RetailerShipper
    serializer_class = RetailerShipperSerializer
    queryset = RetailerShipper.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["name", "created_at"]
    search_fields = ["name", "email"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerShipperSerializer
        return RetailerShipperSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_SHIPPER)
            case _:
                return check_permission(self, Permissions.CREATE_RETAILER_SHIPPER)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(
            retailer_carrier__retailer__organization_id=organization_id
        )


class UpdateDeleteRetailerShipperView(RetrieveUpdateDestroyAPIView):
    model = RetailerShipper
    serializer_class = RetailerShipperSerializer
    lookup_field = "id"
    queryset = RetailerShipper.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerShipperSerializer
        return RetailerShipperSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_SHIPPER)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_RETAILER_SHIPPER)
            case _:
                return check_permission(self, Permissions.UPDATE_RETAILER_SHIPPER)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(
            retailer_carrier__retailer__organization_id=organization_id
        )
