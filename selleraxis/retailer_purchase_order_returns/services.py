from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError

from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.models import Product
from selleraxis.retailer_purchase_order_histories.models import (
    RetailerPurchaseOrderHistory,
)
from selleraxis.retailer_purchase_orders.models import QueueStatus

from .models import Status


def change_status_when_return(order, user):
    """
    Change the status of a purchase order and the status of purchase order history to 'Returned'.
    Args:
        order: An object representing a purchase order.
    """
    # change status of the order to Returned
    order.status = QueueStatus.Returned
    order.save()
    # add status to orderhistory
    RetailerPurchaseOrderHistory.objects.create(
        status=QueueStatus.Returned, order_id=order.id, user=user
    )


def update_product_quantity_when_return(
    return_item_instance, order_return_status, delete=False
):
    """
    Update the quantity on hand of a product based on a returned item.

    Args:
        return_item_instance (object): The returned item instance.
        order_return_status (str): The status of the order return, can be 'Return_received' or 'Return_opened'.
        delete (bool, optional): If True, subtracts the returned quantity; if False, adds the returned quantity.

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
    if order_return_status == Status.Return_received and delete:
        product.qty_on_hand -= return_item_instance.return_qty * sku_quantity
    elif order_return_status == Status.Return_opened and delete is False:
        product.qty_on_hand += return_item_instance.return_qty * sku_quantity
    product.save()


def bulk_update_product_quantity_when_return(
    return_item_instances, order_return_status, delete=False
):
    """
    Update the quantity on hand of products based on returned items.

    Args:
        return_item_instances (list): List of returned item instances.
        order_return_status (str): The status of the order return, can be 'Return_received' or 'Return_opened'.
        delete (bool, optional): If True, subtracts the returned quantity; if False, adds the returned quantity.

    Raises:
        NotFound: Raised if the associated product is not found for an item.
        ValidationError: Raised if the order is not eligible to perform the specified action.
    """

    conditions = []
    for return_item_instance in return_item_instances:
        condition = Q(merchant_sku=return_item_instance.item.merchant_sku) & Q(
            retailer_id=return_item_instance.item.order.batch.retailer_id
        )
        conditions.append(condition)
    combined_condition = conditions.pop()
    for condition in conditions:
        combined_condition = combined_condition.__or__(condition)
    list_product_alias = ProductAlias.objects.filter(combined_condition).select_related(
        "retailer", "product"
    )
    list_return_qty = [
        return_item_instance.return_qty
        for return_item_instance in return_item_instances
    ]
    product_qty_dict = {}
    product_lst = []
    for idx, product_alias in enumerate(list_product_alias):
        try:
            product = product_alias.product
        except Exception:
            raise NotFound("Product not found for the item")
        product_lst.append(product)
        sku_quantity = product_alias.sku_quantity
        if product.id not in product_qty_dict:
            product_qty_dict[product.id] = 0
        if order_return_status == Status.Return_received and delete:
            product_qty_dict[product.id] -= list_return_qty[idx] * sku_quantity
        elif order_return_status == Status.Return_opened and delete is False:
            product_qty_dict[product.id] += list_return_qty[idx] * sku_quantity
        else:
            raise ValidationError("the order is not eligible to perform this action")

    for product in product_lst:
        product.qty_on_hand += product_qty_dict[product.id]
    Product.objects.bulk_update(product_lst, ["qty_on_hand"])
