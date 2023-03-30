from django.db import models

from selleraxis.retailers.models import Retailer


class RetailerPartner(models.Model):
    retailer_partner_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    role_type = models.CharField(max_length=255)
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
