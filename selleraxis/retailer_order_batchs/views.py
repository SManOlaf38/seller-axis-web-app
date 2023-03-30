from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_order_batchs.models import RetailerOrderBatch
from selleraxis.retailer_order_batchs.serializers import RetailerOrderBatchSerializer


class ListCreateRetailerOrderBatchView(ListCreateAPIView):
    model = RetailerOrderBatch
    serializer_class = RetailerOrderBatchSerializer
    queryset = RetailerOrderBatch.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["batch_number", "created_at"]
    search_fields = ["batch_number"]
    filterset_fields = ["retailer"]

    def get_queryset(self):
        return self.queryset.filter(
            retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_ORDER_BATCH)
            case _:
                return check_permission(self, Permissions.CREATE_RETAILER_ORDER_BATCH)


class UpdateDeleteRetailerOrderBatchView(RetrieveUpdateDestroyAPIView):
    model = RetailerOrderBatch
    serializer_class = RetailerOrderBatchSerializer
    lookup_field = "id"
    queryset = RetailerOrderBatch.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_ORDER_BATCH)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_RETAILER_ORDER_BATCH)
            case _:
                return check_permission(self, Permissions.UPDATE_RETAILER_ORDER_BATCH)
