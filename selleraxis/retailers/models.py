from django.db import models

from selleraxis.organizations.models import Organization
from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailer_warehouses.models import RetailerWarehouse


class Retailer(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255, blank=True, default="")
    merchant_id = models.CharField(max_length=255, default="lowes")
    qbo_customer_ref_id = models.CharField(max_length=100, default="1", blank=True)
    default_warehouse = models.ForeignKey(
        RetailerWarehouse,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="retailer_organization",
        default=None,
    )
    default_carrier = models.ForeignKey(
        RetailerCarrier,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="retailer_carrier",
        default=None,
    )
    vendor_id = models.CharField(max_length=255, null=True)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="retailer_organization"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
