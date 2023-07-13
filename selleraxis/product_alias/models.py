from django.db import models

from selleraxis.products.models import Product
from selleraxis.retailers.models import Retailer


class ProductAlias(models.Model):
    sku = models.CharField(max_length=100)
    merchant_sku = models.CharField(max_length=100)
    vendor_sku = models.CharField(max_length=100)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="products_aliases"
    )
    retailer = models.ForeignKey(
        Retailer, on_delete=models.CASCADE, related_name="retailer_products_aliases"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
