from django.db import models

from selleraxis.addresses.models import Address
from selleraxis.core.base_model import SQSSyncModel
from selleraxis.gs1.models import GS1
from selleraxis.organizations.models import Organization
from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailer_warehouses.models import RetailerWarehouse
from selleraxis.shipping_ref_type.models import ShippingRefType


class Retailer(SQSSyncModel):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255, blank=True, default="")
    merchant_id = models.CharField(max_length=255, default="lowes")
    qbo_customer_ref_id = models.CharField(max_length=100, null=True, blank=True)
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
    shipping_ref_1_value = models.CharField(max_length=255, null=True, blank=True)
    shipping_ref_2_value = models.CharField(max_length=255, null=True, blank=True)
    shipping_ref_3_value = models.CharField(max_length=255, null=True, blank=True)
    shipping_ref_4_value = models.CharField(max_length=255, null=True, blank=True)
    shipping_ref_5_value = models.CharField(max_length=255, null=True, blank=True)
    shipping_ref_1_type = models.ForeignKey(
        ShippingRefType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="shipping_ref_1_type",
    )
    shipping_ref_2_type = models.ForeignKey(
        ShippingRefType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="shipping_ref_2_type",
    )
    shipping_ref_3_type = models.ForeignKey(
        ShippingRefType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="shipping_ref_3_type",
    )
    shipping_ref_4_type = models.ForeignKey(
        ShippingRefType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="shipping_ref_4_type",
    )
    shipping_ref_5_type = models.ForeignKey(
        ShippingRefType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="shipping_ref_5_type",
    )
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="retailer_organization"
    )
    sync_token = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
