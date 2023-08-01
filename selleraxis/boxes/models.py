from django.db import models

from selleraxis.barcode_sizes.models import BarcodeSize
from selleraxis.organizations.models import Organization


class Box(models.Model):
    name = models.CharField(max_length=100)
    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    dimension_unit = models.CharField(max_length=100)
    barcode_size = models.ForeignKey(BarcodeSize, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
