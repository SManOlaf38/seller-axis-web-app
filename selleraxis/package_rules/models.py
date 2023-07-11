from django.db import models

from selleraxis.organizations.models import Organization


class PackageRule(models.Model):
    name = models.CharField(max_length=255)
    height = models.IntegerField(default=0)
    length = models.IntegerField(default=0)
    wight = models.IntegerField(default=0)
    dimension_unit = models.CharField(max_length=255, default="lb")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
