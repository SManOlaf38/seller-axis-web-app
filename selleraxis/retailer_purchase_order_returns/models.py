from django.db import models

from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.retailer_warehouses.models import RetailerWarehouse


class RetailerPurchaseOrderReturn(models.Model):
    order = models.ForeignKey(
        RetailerPurchaseOrder, related_name="order_returns", on_delete=models.CASCADE
    )
    is_dispute = models.BooleanField(default=False)
    dispute_date = models.DateField(null=True, blank=True)
    warehouse = models.ForeignKey(
        RetailerWarehouse, related_name="warehouse_returns", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
