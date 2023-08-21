from django.db import models

from selleraxis.organizations.models import Organization
from selleraxis.services.models import Services


class RetailerCarrier(models.Model):
    client_id = models.TextField()
    client_secret = models.TextField()
    account_number = models.CharField(max_length=255, default="")
    service = models.ForeignKey(
        Services, on_delete=models.CASCADE, related_name="retailer_carrier_services"
    )
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="organizations", null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
