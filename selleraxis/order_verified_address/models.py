from django.db import models
from django.utils.translation import gettext_lazy as _


class OrderVerifiedAddress(models.Model):
    class Status(models.TextChoices):
        ORIGIN = "ORIGIN", _("ORIGIN")
        EDITED = "EDITED", _("EDITED")
        VERIFIED = "VERIFIED", _("VERIFIED")

    company = models.CharField(max_length=255, blank=True, null=True)
    contact_name = models.CharField(max_length=255)
    address_1 = models.CharField(max_length=255)
    address_2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    status = models.CharField(
        max_length=255, default=Status.ORIGIN, choices=Status.choices
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
