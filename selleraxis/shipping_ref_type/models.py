from django.db import models


class ShippingRefType(models.Model):
    name = models.CharField(max_length=255)
    data_field = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
