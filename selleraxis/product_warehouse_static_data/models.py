from django.db import models

from selleraxis.retailer_warehouse_products.models import RetailerWarehouseProduct


class ProductWarehouseStaticData(models.Model):
    qty_on_hand = models.IntegerField()
    next_available_qty = models.IntegerField(blank=True, null=True)
    next_available_date = models.DateTimeField(blank=True, null=True)
    product_warehouse = models.OneToOneField(
        RetailerWarehouseProduct,
        on_delete=models.CASCADE,
        related_name="product_warehouse_statices",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
