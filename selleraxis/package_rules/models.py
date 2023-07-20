from django.db import models

from selleraxis.boxes.models import Box
from selleraxis.product_series.models import ProductSeries
from selleraxis.products.models import Product


class PackageRule(models.Model):
    max_quantity = models.IntegerField(default=1)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    product_series = models.ForeignKey(
        ProductSeries, on_delete=models.CASCADE, null=True
    )
    box = models.ForeignKey(Box, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
