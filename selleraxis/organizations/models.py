from django.db import models

from selleraxis.core.base_model import SoftDeleteModel
from selleraxis.users.models import User


class Organization(SoftDeleteModel):
    name = models.CharField(max_length=255)
    avatar = models.TextField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    timezone = models.CharField(blank=True, default="", max_length=128)
    address = models.CharField(blank=True, default="", max_length=255)
    email = models.CharField(blank=True, default="", max_length=255)
    phone = models.CharField(blank=True, default="", max_length=128)
    status = models.CharField(blank=True, default="", max_length=255)
    realm_id = models.CharField(blank=True, null=True, max_length=255)
    qbo_user_uuid = models.CharField(null=True, max_length=128)
    qbo_access_token = models.TextField(blank=True, null=True)
    qbo_refresh_token = models.TextField(blank=True, null=True)
    qbo_access_token_exp_time = models.DateTimeField(null=True)
    qbo_refresh_token_exp_time = models.DateTimeField(null=True)
    is_sandbox = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sandbox_organization = models.OneToOneField(
        "self", null=True, related_name="prod_organization", on_delete=models.CASCADE
    )
