from django.db import models

from selleraxis.organizations.models import Organization


class BarcodeSize(models.Model):
    name = models.CharField(max_length=255)
    width = models.FloatField()
    height = models.FloatField()
    multiple_per_label = models.BooleanField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
