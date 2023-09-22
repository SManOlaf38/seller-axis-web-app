from django.db import models

from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder


class RetailerPurchaseOrderItem(models.Model):
    retailer_purchase_order_item_id = models.CharField(max_length=255)
    order_line_number = models.CharField(max_length=255)
    merchant_line_number = models.CharField(max_length=255)
    qty_ordered = models.IntegerField()
    unit_of_measure = models.CharField(max_length=255)
    upc = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    description_2 = models.CharField(max_length=255)
    merchant_sku = models.CharField(max_length=255)
    vendor_sku = models.CharField(max_length=255)
    unit_cost = models.FloatField(max_length=255)
    shipping_code = models.CharField(max_length=255)
    expected_ship_date = models.CharField(max_length=255)
    po_line_data = models.JSONField(null=True)
    order = models.ForeignKey(
        RetailerPurchaseOrder, related_name="items", on_delete=models.CASCADE
    )
    cancel_reason = models.CharField(null=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)