from django.db import models

from selleraxis.services.models import Services
from selleraxis.shipping_ref_type.models import ShippingRefType


class ShippingRef(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255)
    service = models.ForeignKey(
        Services, on_delete=models.CASCADE, related_name="shipping_ref_service"
    )
    type = models.ForeignKey(
        ShippingRefType,
        on_delete=models.CASCADE,
        related_name="shipping_ref_type",
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
