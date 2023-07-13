from datetime import datetime

from django.db import models

from selleraxis.retailer_warehouse_products.models import RetailerWarehouseProduct


class ProductWarehouseStaticData(models.Model):
    status = models.CharField(max_length=255)
    qty_on_hand = models.IntegerField()
    next_available_qty = models.IntegerField(blank=True, default=0)
    next_available_date = models.DateTimeField(blank=True, default=datetime.now)
    product_warehouse_id = models.ForeignKey(
        RetailerWarehouseProduct,
        on_delete=models.CASCADE,
        related_name="product_warehouse_statices",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
