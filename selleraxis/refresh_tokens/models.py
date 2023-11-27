from django.db import models
from django.utils.translation import gettext_lazy as _

from selleraxis.users.models import User


class RefreshTokenFamilyStatus(models.TextChoices):
    Active = "Active", _("Active")
    Inactive = "Inactive", _("Inactive")


class RefreshTokenStatus(models.TextChoices):
    New = "New", _("New")
    Used = "Used", _("Used")


class RefreshTokenFamily(models.Model):
    status = models.CharField(
        max_length=10,
        choices=RefreshTokenFamilyStatus.choices,
        default=RefreshTokenFamilyStatus.Active,
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class RefreshToken(models.Model):
    jti = models.CharField(max_length=32, choices=RefreshTokenStatus.choices)
    status = models.CharField(
        max_length=10,
        choices=RefreshTokenStatus.choices,
        default=RefreshTokenStatus.New,
    )
    family = models.ForeignKey(RefreshTokenFamily, on_delete=models.CASCADE)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, default=None
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
