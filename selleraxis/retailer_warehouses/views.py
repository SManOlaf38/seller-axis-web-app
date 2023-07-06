from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_warehouses.models import RetailerWarehouse
from selleraxis.retailer_warehouses.serializers import RetailerWarehouseAliasSerializer


class ListCreateRetailerWarehouseView(ListCreateAPIView):
    model: RetailerWarehouse
    serializer_class = RetailerWarehouseAliasSerializer
    queryset = RetailerWarehouse.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at", "retailer"]
    search_fields = ["name", "retailer"]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_WAREHOUSE)
            case _:
                return check_permission(self, Permissions.CREATE_RETAILER_WAREHOUSE)


class UpdateDeleteRetailerWarehouseView(RetrieveUpdateDestroyAPIView):
    serializer_class = RetailerWarehouseAliasSerializer
    lookup_field = "id"
    queryset = RetailerWarehouse.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_WAREHOUSE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_RETAILER_WAREHOUSE)
            case _:
                return check_permission(self, Permissions.UPDATE_RETAILER_WAREHOUSE)
