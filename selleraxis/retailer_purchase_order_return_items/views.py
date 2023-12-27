from django.db import transaction
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_order_returns.services import (
    change_status_when_return,
    update_product_quantity_when_return,
)
from selleraxis.retailer_purchase_orders.models import QueueStatus

from .models import RetailerPurchaseOrderReturnItem
from .serializers import (
    ReadRetailerPurchaseOrderReturnItemSerializer,
    RetailerPurchaseOrderReturnItemSerializer,
)


class ListCreateRetailerPurchaseOrderReturnItemView(ListCreateAPIView):
    model = RetailerPurchaseOrderReturnItem
    serializer_class = RetailerPurchaseOrderReturnItemSerializer
    queryset = RetailerPurchaseOrderReturnItem.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")

        return RetailerPurchaseOrderReturnItem.objects.filter(
            order_return__order__batch__retailer__organization_id=organization_id
        ).select_related(
            "item__order__batch",
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderReturnItemSerializer
        return RetailerPurchaseOrderReturnItemSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        order_return = serializer.validated_data.get("order_return")
        order = order_return.order
        order_status = order.status
        items_in_order = RetailerPurchaseOrderItem.objects.filter(order=order)
        if serializer.validated_data.get("item") not in items_in_order:
            raise ValidationError("the item does not belong for the order")
        # check order status condition
        if order_status not in [
            QueueStatus.Shipment_Confirmed,
            QueueStatus.Partly_Shipped_Confirmed,
            QueueStatus.Invoiced,
            QueueStatus.Invoice_Confirmed,
        ]:
            error_message = (
                "Status of order must be Shipment Confirmed or Partly Shipped Confirmed"
            )
            raise ValidationError(error_message)
        return_item_instance = serializer.save()
        update_product_quantity_when_return(return_item_instance=return_item_instance)
        change_status_when_return(order=order)
        return return_item_instance

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PURCHASE_ORDER_RETURN_ITEM
                )
            case _:
                return check_permission(
                    self, Permissions.CREATE_RETAILER_PURCHASE_ORDER_RETURN_ITEM
                )


class RetrieveRetailerPurchaseOrderReturnItemView(RetrieveAPIView):
    model = RetailerPurchaseOrderReturnItem
    lookup_field = "id"
    serializer_class = ReadRetailerPurchaseOrderReturnItemSerializer
    queryset = RetailerPurchaseOrderReturnItem.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            order_return__order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        ).select_related(
            "item__order__batch",
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PURCHASE_ORDER_RETURN_ITEM
                )
