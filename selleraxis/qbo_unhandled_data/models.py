from django.db import models

from selleraxis.organizations.models import Organization


class QBOUnhandledData(models.Model):
    model = models.CharField(max_length=255)
    action = models.CharField(max_length=255)
    object_id = models.IntegerField(null=False)
    status = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
