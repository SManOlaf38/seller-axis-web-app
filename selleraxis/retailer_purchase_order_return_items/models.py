from django.db import models
from django.utils.translation import gettext_lazy as _

from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_order_returns.models import (
    RetailerPurchaseOrderReturn,
)


class ReturnReason(models.TextChoices):
    Courtesy_Return = "Courtesy Return", _("Courtesy Return")
    Ordered_Wrong_Item = "Ordered Wrong Item", _("Ordered Wrong Item")
    Warranty = "Warranty", _("Warranty")
    Changed_Mind = "Changed Mind", _("Changed Mind")
    Received_Wrong_Item = "Received Wrong Item", _("Received Wrong Item")
    Rental = "Retal", _("Retal")
    Damaged = "Damaged", _("Damaged")
    Defective = "Defective", _("Defective")
    Arrived_Too_Late = "Arrived Too Late", _("Arrived Too Late")


class RetailerPurchaseOrderReturnItem(models.Model):
    item = models.ForeignKey(
        RetailerPurchaseOrderItem,
        related_name="item_returns",
        on_delete=models.CASCADE,
    )
    order_return = models.ForeignKey(
        RetailerPurchaseOrderReturn,
        related_name="order_returns_items",
        on_delete=models.CASCADE,
    )
    return_qty = models.PositiveIntegerField(default=0)
    damaged_qty = models.PositiveIntegerField(default=0)
    reason = models.CharField(max_length=255, choices=ReturnReason.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
