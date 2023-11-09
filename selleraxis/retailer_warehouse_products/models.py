from django.db import models

from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_warehouses.models import RetailerWarehouse


class RetailerWarehouseProduct(models.Model):
    product_alias = models.ForeignKey(
        ProductAlias,
        on_delete=models.CASCADE,
        related_name="retailer_product_aliases",
    )
    retailer_warehouse = models.ForeignKey(
        RetailerWarehouse,
        on_delete=models.CASCADE,
        related_name="retailer_warehouse_products",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
