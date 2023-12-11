from rest_framework import status
from rest_framework.exceptions import NotFound, ParseError, ValidationError
from rest_framework.response import Response

from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_purchase_order_histories.models import (
    RetailerPurchaseOrderHistory,
)
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_orders.models import QueueStatus


def create_order_return_item_service(order_return, serializer, unbroken_qty):
    try:
        order = order_return.order
        order_status = order.status
        items_in_order = RetailerPurchaseOrderItem.objects.filter(order=order)
        if serializer.get("item") not in items_in_order:
            raise ValidationError("the item does not belong for the order")

        # check order status condition
        if order_status not in [
            QueueStatus.Shipment_Confirmed,
            QueueStatus.Partly_Shipped_Confirmed,
        ]:
            error_message = (
                "Status of order must be Shipment Confirmed or Partly Shipped Confirmed"
            )
            return Response(
                {"detail": error_message}, status=status.HTTP_400_BAD_REQUEST
            )

        # get product of this item
        item_return = serializer.save()
        product_alias = (
            ProductAlias.objects.filter(
                merchant_sku=item_return.item.merchant_sku,
                retailer_id=item_return.item.order.batch.retailer_id,
            )
            .select_related("product")
            .last()
        )
        try:
            product = product_alias.product
        except Exception:
            raise NotFound("not found product from this item")

        # add unbroken_quantity from order_return_item to quantity_on_hand of the product
        sku_quantity = product_alias.sku_quantity
        product.qty_on_hand += unbroken_qty * sku_quantity
        product.save()

        # change status of the order to Returned
        order.status = QueueStatus.Returned
        order.save()

        # add status to orderhistory
        new_order_history = RetailerPurchaseOrderHistory(
            status=QueueStatus.Returned,
            order_id=order.id,
        )
        new_order_history.save()

    except Exception as e:
        raise ParseError(e)
