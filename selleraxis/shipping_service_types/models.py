from django.db import models

from selleraxis.services.models import Services


class ShippingServiceType(models.Model):
    name = models.CharField(max_length=155)
    code = models.CharField(max_length=255)
    service = models.ForeignKey(
        Services, related_name="shipping_services", on_delete=models.SET_NULL, null=True
    )
    commercehub_code = models.CharField(max_length=100, null=True)
    is_require_residential = models.BooleanField(default=False)
    max_weight = models.FloatField(null=True)
    min_weight = models.FloatField(null=True)
    max_length_plus_girth = models.FloatField(null=True)
    max_length = models.FloatField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
