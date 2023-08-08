from django.db import models

from selleraxis.services.models import Services


class ShippingServiceType(models.Model):
    name = models.CharField(max_length=155)
    code = models.CharField(max_length=255)
    service = models.ForeignKey(
        Services, related_name="shipping_services", on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
