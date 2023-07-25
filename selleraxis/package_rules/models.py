from django.db import models

from selleraxis.boxes.models import Box
from selleraxis.product_series.models import ProductSeries


class PackageRule(models.Model):
    max_quantity = models.IntegerField(default=1)
    product_series = models.ForeignKey(
        ProductSeries, on_delete=models.CASCADE, null=True, related_name="package_rules"
    )
    box = models.ForeignKey(Box, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
