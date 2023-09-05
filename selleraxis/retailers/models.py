from django.db import models

from selleraxis.addresses.models import Address
from selleraxis.gs1.models import GS1
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
        related_name="retailer_warehouse",
        on_delete=models.CASCADE,
    )
    default_carrier = models.ForeignKey(
        RetailerCarrier,
        null=True,
        blank=True,
        related_name="retailer_carrier",
        on_delete=models.CASCADE,
    )
    default_gs1 = models.ForeignKey(
        GS1,
        null=True,
        blank=True,
        related_name="retailer",
        on_delete=models.CASCADE,
    )
    ship_from_address = models.ForeignKey(
        Address,
        null=True,
        blank=True,
        related_name="retailer_address",
        on_delete=models.CASCADE,
    )
    vendor_id = models.CharField(max_length=255, null=True)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="retailer_organization"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
