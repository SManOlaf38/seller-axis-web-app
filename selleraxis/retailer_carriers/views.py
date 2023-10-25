from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

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
    ordering_fields = ["service", "retailer", "created_at"]
    search_fields = ["service__name", "account_number", "shipper__name"]

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
        return self.queryset.filter(organization_id=organization_id)


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
        return self.queryset.filter(organization_id=organization_id)
