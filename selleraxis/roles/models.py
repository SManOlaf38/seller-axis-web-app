from django.contrib.postgres.fields import ArrayField
from django.db import models

from selleraxis.organizations.models import Organization
from selleraxis.permissions.models import Permissions


class Role(models.Model):
    name = models.CharField(max_length=255)
    permissions = ArrayField(
        models.CharField(max_length=255, choices=Permissions.choices)
    )
    organization = models.ForeignKey(
        Organization, related_name="roles", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
