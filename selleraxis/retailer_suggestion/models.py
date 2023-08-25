from django.db import models


class RetailerSuggestion(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    merchant_sku_prefix = models.JSONField(default=list)
    merchant_sku_min_length = models.IntegerField(default=1)
    merchant_sku_max_length = models.IntegerField(null=True)
    merchant_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
