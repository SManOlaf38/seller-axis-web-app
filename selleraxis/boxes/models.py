from django.db import models

from selleraxis.barcode_sizes.models import BarcodeSize
from selleraxis.package_rules.models import PackageRule


class Box(models.Model):
    name = models.CharField(max_length=100)
    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    dimension_unit = models.CharField(max_length=100)
    max_quantity = models.IntegerField()
    barcode_size = models.ForeignKey(BarcodeSize, on_delete=models.CASCADE)
    package_rule = models.ForeignKey(PackageRule, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
