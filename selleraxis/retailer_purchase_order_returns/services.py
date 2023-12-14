from rest_framework.exceptions import NotFound

from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.models import Product
from selleraxis.retailer_purchase_order_histories.models import (
    RetailerPurchaseOrderHistory,
)
from selleraxis.retailer_purchase_orders.models import QueueStatus


def change_status_when_return(order):
    """
    Change the status of a purchase order and the status of purchase order history to 'Returned'.
    Args:
        order: An object representing a purchase order.
    """
    # change status of the order to Returned
    order.status = QueueStatus.Returned
    order.save()
    # add status to orderhistory
    new_order_history = RetailerPurchaseOrderHistory(
        status=QueueStatus.Returned,
        order_id=order.id,
    )
    new_order_history.save()


def update_product_quantity_when_return(return_item_instance, is_dispute=True):
    """
    Update the quantity on hand of a product based on a returned item.

    Args:
        return_item_instance: The returned item instance.
        is_add_quantity (bool, optional): Flag to indicate whether to add or subtract quantity.
                                          Defaults to True (add quantity).
    Raises:
        NotFound: Raised if the associated product is not found for the given item.
    """
    product_alias = (
        ProductAlias.objects.filter(
            merchant_sku=return_item_instance.item.merchant_sku,
            retailer_id=return_item_instance.item.order.batch.retailer_id,
        )
        .select_related("product")
        .last()
    )
    try:
        product = product_alias.product
    except Exception:
        raise NotFound("not found product from this item")
    sku_quantity = product_alias.sku_quantity
    if is_dispute:
        product.qty_on_hand -= return_item_instance.return_qty * sku_quantity
    else:
        product.qty_on_hand += return_item_instance.return_qty * sku_quantity
    product.save()


def bulk_update_product_quantity_when_return(return_item_instances, is_dispute=False):
    """
    Update the quantity on hand of products based on returned items.

    Args:
        return_item_instances (list): List of returned item instances.
        is_add_quantity (bool, optional): Flag to indicate whether to add or subtract quantity.
                                          Defaults to True (add quantity).
    Raises:
        NotFound: Raised if the associated product is not found for an item.
    """
    products_to_update = []
    for return_item_instance in return_item_instances:
        product_alias = (
            ProductAlias.objects.filter(
                merchant_sku=return_item_instance.item.merchant_sku,
                retailer_id=return_item_instance.item.order.batch.retailer_id,
            )
            .select_related("product")
            .last()
        )
        try:
            product = product_alias.product
        except Exception:
            raise NotFound("Product not found for the item")
        sku_quantity = product_alias.sku_quantity
        print(product.id)
        if is_dispute:
            product.qty_on_hand -= return_item_instance.return_qty * sku_quantity
        else:
            product.qty_on_hand += return_item_instance.return_qty * sku_quantity
        products_to_update.append(product)
    Product.objects.bulk_update(products_to_update, ["qty_on_hand"])
