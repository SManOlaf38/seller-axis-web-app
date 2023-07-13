from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.core.views import BulkUpdateAPIView
from selleraxis.permissions.models import Permissions

from .models import ProductWarehouseStaticData
from .serializers import (
    BulkProductWarehouseStaticDataSerializer,
    ProductWarehouseStaticDataSerializer,
)


class ListCreateProductWarehouseStaticDataView(ListCreateAPIView):
    model = ProductWarehouseStaticData
    serializer_class = ProductWarehouseStaticDataSerializer
    queryset = ProductWarehouseStaticData.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination

    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["status", "created_at"]
    search_fields = ["status"]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case _:
                return check_permission(
                    self, Permissions.CREATE_PRODUCT_WAREHOUSE_STATIC_DATA
                )


class UpdateDeleteProductWarehouseStaticDataView(RetrieveUpdateDestroyAPIView):
    model = ProductWarehouseStaticData
    serializer_class = ProductWarehouseStaticDataSerializer
    lookup_field = "id"
    queryset = ProductWarehouseStaticData.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case _:
                return check_permission(
                    self, Permissions.UPDATE_PRODUCT_WAREHOUSE_STATIC_DATA
                )


class BulkUpdateDeleteProductWarehouseStaticDataView(BulkUpdateAPIView):
    queryset = ProductWarehouseStaticData.objects.all()
    serializer_class = BulkProductWarehouseStaticDataSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case _:
                return check_permission(
                    self, Permissions.UPDATE_PRODUCT_WAREHOUSE_STATIC_DATA
                )


####
