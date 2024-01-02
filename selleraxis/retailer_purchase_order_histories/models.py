from django.db import models

from selleraxis.retailer_purchase_orders.models import (
    QueueStatus,
    RetailerPurchaseOrder,
)
from selleraxis.retailer_queue_histories.models import RetailerQueueHistory
from selleraxis.users.models import User


class RetailerPurchaseOrderHistory(models.Model):
    user = models.ForeignKey(
        User, related_name="user_order_history", on_delete=models.CASCADE, null=True
    )
    status = models.CharField(
        max_length=255, choices=QueueStatus.choices, default=QueueStatus.Opened
    )
    order = models.ForeignKey(
        RetailerPurchaseOrder, related_name="order_history", on_delete=models.CASCADE
    )
    queue_history = models.ForeignKey(
        RetailerQueueHistory,
        related_name="order_queue_history",
        on_delete=models.CASCADE,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
