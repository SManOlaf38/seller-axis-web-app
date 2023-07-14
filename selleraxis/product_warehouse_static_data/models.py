from django.db import models

from selleraxis.retailer_warehouse_products.models import RetailerWarehouseProduct


class ProductWarehouseStaticData(models.Model):
    status = models.CharField(max_length=255)
    qty_on_hand = models.IntegerField()
    next_available_qty = models.IntegerField()
    next_available_date = models.DateTimeField()
    product_warehouse_id = models.OneToOneField(
        RetailerWarehouseProduct, on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
