from django.db import models

from selleraxis.barcode_sizes.models import BarcodeSize
from selleraxis.organizations.models import Organization
from selleraxis.package_rules.models import PackageRule
from selleraxis.product_types.models import ProductType


class Product(models.Model):
    product_type = models.ForeignKey(ProductType, on_delete=models.CASCADE)
    vendor_merch_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image_url = models.TextField()
    cost = models.FloatField()
    sale_price = models.FloatField()
    model_series = models.CharField(max_length=255)
    master_sku = models.CharField(max_length=255)
    package_rule = models.ForeignKey(PackageRule, on_delete=models.CASCADE)
    child_sku = models.CharField(max_length=255)
    upc = models.CharField(max_length=255)
    sku_quantity = models.IntegerField()
    weight = models.FloatField()
    weight_unit = models.CharField(max_length=255)
    length = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    dimension_unit = models.CharField(max_length=255)
    barcode_size = models.ForeignKey(BarcodeSize, on_delete=models.CASCADE)
    qbo_item_id = models.CharField(max_length=255)
    commodity_code = models.CharField(max_length=255)
    country_of_manufacture = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
