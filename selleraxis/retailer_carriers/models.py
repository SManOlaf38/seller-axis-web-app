from django.db import models

from selleraxis.retailers.models import Retailer
from selleraxis.services.models import Services


class RetailerCarrier(models.Model):
    client_id = models.TextField()
    client_secret = models.TextField()
    account_number = models.CharField(max_length=255, default="")
    is_default = models.BooleanField(default=False)
    service = models.ForeignKey(Services, on_delete=models.CASCADE)
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
