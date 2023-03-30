from django.db import models

from selleraxis.retailers.models import Retailer


class RetailerParticipatingParty(models.Model):
    retailer_participating_party_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    role_type = models.CharField(max_length=255)
    participation_code = models.CharField(max_length=255)
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
