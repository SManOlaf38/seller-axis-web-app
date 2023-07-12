from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_warehouse_products.models import RetailerWarehouseProduct
from selleraxis.retailer_warehouse_products.serializers import (
    ReadRetailerWarehouseProductSerializer,
    RetailerWarehouseProductSerializer,
)


class ListCreateRetailerWarehouseProductView(ListCreateAPIView):
    model: RetailerWarehouseProduct
    serializer_class = RetailerWarehouseProductSerializer
    queryset = RetailerWarehouseProduct.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at", "product_alias", "retailer_warehouse"]
    search_fields = ["product_alias", "retailer_warehouse"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerWarehouseProductSerializer
        return RetailerWarehouseProductSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT)


class UpdateDeleteRetailerWarehouseProductView(RetrieveUpdateDestroyAPIView):
    serializer_class = RetailerWarehouseProductSerializer
    lookup_field = "id"
    queryset = RetailerWarehouseProduct.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerWarehouseProductSerializer
        return RetailerWarehouseProductSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT)
