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
