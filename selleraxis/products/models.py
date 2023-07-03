from django.db import models

from selleraxis.organizations.models import Organization
from selleraxis.package_rules.models import PackageRule


class Product(models.Model):
    sku = models.CharField(max_length=100)
    unit_of_measure = models.CharField(max_length=100)
    available = models.CharField(max_length=100)
    upc = models.CharField(max_length=100)
    description = models.TextField()
    unit_cost = models.FloatField()
    qty_on_hand = models.IntegerField()
    qty_reserve = models.IntegerField()
    image = models.TextField()
    package_rule = models.ForeignKey(PackageRule, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
