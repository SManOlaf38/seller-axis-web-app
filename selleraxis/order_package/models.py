from django.db import models

from selleraxis.boxes.models import Box
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder


class OrderPackage(models.Model):
    box = models.ForeignKey(Box, on_delete=models.CASCADE, null=True)
    order = models.ForeignKey(
        RetailerPurchaseOrder, related_name="order_packages", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
