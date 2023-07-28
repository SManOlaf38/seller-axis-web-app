from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_order_items.serializers import (
    RetailerPurchaseOrderItemSerializer,
)


class ListCreateRetailerPurchaseOrderItemView(ListCreateAPIView):
    model = RetailerPurchaseOrderItem
    serializer_class = RetailerPurchaseOrderItemSerializer
    queryset = RetailerPurchaseOrderItem.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["retailer_purchase_order_item_id", "created_at"]
    search_fields = ["retailer_purchase_order_item_id"]
    filterset_fields = ["order"]

    def get_queryset(self):
        return self.queryset.filter(
            order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        ).select_related("order__batch")

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PURCHASE_ORDER_ITEM
                )
            case _:
                return check_permission(
                    self, Permissions.CREATE_RETAILER_PURCHASE_ORDER_ITEM
                )


class UpdateDeleteRetailerPurchaseOrderItemView(RetrieveUpdateDestroyAPIView):
    model = RetailerPurchaseOrderItem
    serializer_class = RetailerPurchaseOrderItemSerializer
    lookup_field = "id"
    queryset = RetailerPurchaseOrderItem.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PURCHASE_ORDER_ITEM
                )
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_RETAILER_PURCHASE_ORDER_ITEM
                )
            case _:
                return check_permission(
                    self, Permissions.UPDATE_RETAILER_PURCHASE_ORDER_ITEM
                )
