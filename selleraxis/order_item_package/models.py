from django.db import models

from selleraxis.order_package.models import OrderPackage
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem


class OrderItemPackage(models.Model):
    quantity = models.IntegerField()
    package = models.ForeignKey(
        OrderPackage,
        on_delete=models.CASCADE,
        null=True,
        related_name="order_item_packages",
    )
    order_item = models.ForeignKey(
        RetailerPurchaseOrderItem,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
