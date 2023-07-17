from django.db import models

from selleraxis.organizations.models import Organization


class Retailer(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255, blank=True, default="")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
