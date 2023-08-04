from django.db import models

from selleraxis.order_package.models import OrderPackage
from selleraxis.retailer_carriers.models import RetailerCarrier


class ShipmentStatus(models.TextChoices):
    CREATED = "CREATED"
    CANCELED = "CANCELED"


class Shipment(models.Model):
    status = models.CharField(max_length=128, choices=ShipmentStatus.choices)
    tracking_number = models.CharField(max_length=128)
    package_document = models.TextField()
    carrier = models.ForeignKey(RetailerCarrier, null=True, on_delete=models.SET_NULL)
    package = models.ForeignKey(
        OrderPackage,
        null=True,
        on_delete=models.SET_NULL,
        related_name="shipment_packages",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
