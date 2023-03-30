from django.contrib.postgres.fields import ArrayField
from django.db import models

from selleraxis.organizations.models import Organization


class PackageRule(models.Model):
    name = models.CharField(max_length=255)
    box_sizes = ArrayField(models.IntegerField())
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
