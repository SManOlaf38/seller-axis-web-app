from django.db import models

from selleraxis.retailers.models import Retailer


class RetailerWarehouse(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField()
    address_1 = models.CharField(max_length=255)
    address_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    postal_code = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    retailer = models.ForeignKey(
        Retailer, on_delete=models.CASCADE, related_name="retailer_warehouses"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
