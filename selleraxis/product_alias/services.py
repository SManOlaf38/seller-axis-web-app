from selleraxis.product_alias.exceptions import DeleteAliasException
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_orders.models import QueueStatus


def delete_product_alias(id):
    product_alias = ProductAlias.objects.filter(id=id).first()
    po_items = RetailerPurchaseOrderItem.objects.filter(
        merchant_sku=product_alias.merchant_sku,
        order__batch__retailer_id=product_alias.retailer.id,
    )
    orders = [po_item.order for po_item in po_items]
    filter_orders = []
    for order in orders:
        if (
            order.status == QueueStatus.Opened
            or order.status == QueueStatus.Acknowledged
            or order.status == QueueStatus.Bypassed_Acknowledge
            or order.status == QueueStatus.Backorder
        ):
            filter_orders.append(order.id)
    if len(filter_orders) > 0:
        raise DeleteAliasException
    return True
