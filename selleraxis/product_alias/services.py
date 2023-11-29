from selleraxis.product_alias.exceptions import DeleteAliasException
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_orders.models import (
    QueueStatus,
    RetailerPurchaseOrder,
)


def delete_product_alias(product_alias):
    po_items = RetailerPurchaseOrderItem.objects.filter(
        merchant_sku=product_alias.merchant_sku,
        order__batch__retailer_id=product_alias.retailer.id,
    ).select_related("order")
    order_ids = [po_item.order.id for po_item in po_items]
    list_order = RetailerPurchaseOrder.objects.filter(
        id__in=order_ids
    ).prefetch_related("order_packages")
    filter_orders = []
    for order in list_order:
        if order.status not in [QueueStatus.Opened, QueueStatus.Cancelled]:
            filter_orders.append(order.id)
        else:
            list_order_package = order.order_packages.all()
            if list_order_package is not None or len(list_order_package) > 0:
                filter_orders.append(order.id)
    if len(filter_orders) > 0:
        raise DeleteAliasException
    return True
