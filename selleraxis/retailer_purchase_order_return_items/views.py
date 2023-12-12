from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_order_returns.services import (
    change_status_when_return,
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

    def perform_create(self, serializer):
        unbroken_qty = serializer.validated_data.get("unbroken_qty")
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
        ]:
            error_message = (
                "Status of order must be Shipment Confirmed or Partly Shipped Confirmed"
            )
            raise ValidationError(error_message)
        item_return_instance = serializer.save()
        # add unbroken_quantity from order_return_item to quantity_on_hand of the product
        product_alias = (
            ProductAlias.objects.filter(
                merchant_sku=item_return_instance.item.merchant_sku,
                retailer_id=item_return_instance.item.order.batch.retailer_id,
            )
            .select_related("product")
            .last()
        )
        try:
            product = product_alias.product
        except Exception:
            raise NotFound("not found product from this item")
        sku_quantity = product_alias.sku_quantity
        product.qty_on_hand += unbroken_qty * sku_quantity
        product.save()
        change_status_when_return(order=order)
        return item_return_instance

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
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PURCHASE_ORDER_RETURN_ITEM
                )
