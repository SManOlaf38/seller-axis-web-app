from django.db import models
from django.utils.translation import gettext_lazy as _

from selleraxis.organizations.models import Organization
from selleraxis.retailer_carriers.models import RetailerCarrier


class Address(models.Model):
    class Classification(models.TextChoices):
        MIXED = "MIXED", _("MIXED")
        UNKNOWN = "UNKNOWN", _("UNKNOWN")
        BUSINESS = "BUSINESS", _("BUSINESS")
        RESIDENTIAL = "RESIDENTIAL", _("RESIDENTIAL")

    class Status(models.TextChoices):
        ORIGIN = "UNVERIFIED", _("UNVERIFIED")
        EDITED = "EDITED", _("EDITED")
        VERIFIED = "VERIFIED", _("VERIFIED")
        FAILED = "FAILED", _("FAILED")

    company = models.CharField(max_length=128, blank=True, null=True)
    contact_name = models.CharField(max_length=128, blank=True, null=True)
    address_1 = models.CharField(max_length=255)
    address_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=128)
    state = models.CharField(max_length=128)
    postal_code = models.CharField(max_length=128)
    country = models.CharField(max_length=128)
    phone = models.CharField(max_length=12)
    email = models.CharField(max_length=255, blank=True, null=True)
    classification = models.CharField(
        max_length=255,
        default=Classification.UNKNOWN,
        choices=Classification.choices,
        blank=True,
    )
    status = models.CharField(
        max_length=255, default=Status.ORIGIN, choices=Status.choices, blank=True
    )
    verified_carrier = models.ForeignKey(
        RetailerCarrier,
        null=True,
        on_delete=models.SET_NULL,
        related_name="carrier_address",
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        null=True,
        related_name="organization_address",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
