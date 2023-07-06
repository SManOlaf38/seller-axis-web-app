from django.db import models

from selleraxis.retailers.models import Retailer


class RetailerWarehouse(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField()
    address = models.CharField(max_length=255)
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
