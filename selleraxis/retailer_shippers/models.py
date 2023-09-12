from django.db import models

from selleraxis.retailer_carriers.models import RetailerCarrier


class RetailerShipper(models.Model):
    name = models.CharField(max_length=100)
    attention_name = models.CharField(max_length=100)
    tax_identification_number = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15)
    email = models.EmailField(max_length=100, blank=True, null=True)
    shipper_number = models.CharField(max_length=100)
    fax_number = models.CharField(max_length=150, blank=True, null=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=150)
    state = models.CharField(max_length=150)
    postal_code = models.CharField(max_length=255)
    country = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    retailer_carrier = models.OneToOneField(
        RetailerCarrier, on_delete=models.CASCADE, related_name="shipper"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
