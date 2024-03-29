from django.db import models

from selleraxis.retailers.models import Retailer


class RetailerPersonPlace(models.Model):
    retailer_person_place_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, null=True, blank=True)
    address_rate_class = models.CharField(max_length=255)
    address_1 = models.CharField(max_length=255)
    address_2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=255)
    day_phone = models.CharField(max_length=255)
    night_phone = models.CharField(max_length=255)
    partner_person_place_id = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True)
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
