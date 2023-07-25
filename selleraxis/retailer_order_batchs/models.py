from django.db import models

from selleraxis.retailer_partners.models import RetailerPartner
from selleraxis.retailers.models import Retailer


class RetailerOrderBatch(models.Model):
    batch_number = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    partner = models.ForeignKey(RetailerPartner, on_delete=models.CASCADE)
    retailer = models.ForeignKey(
        Retailer, on_delete=models.CASCADE, related_name="retailer_order_batch"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
