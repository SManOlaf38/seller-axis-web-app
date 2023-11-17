from django.db import models
from django.utils.translation import gettext_lazy as _

from selleraxis.products.models import Product
from selleraxis.retailers.models import Retailer


class QueueAvailability(models.TextChoices):
    Available = "Available", _("Available")
    Unavailable = "Unavailable", _("Unavailable")
    Discontinued = "Discontinued", _("Discontinued")
    Guaranteed = "Guaranteed", _("Guaranteed")


class ProductAlias(models.Model):
    sku = models.CharField(max_length=100)
    merchant_sku = models.CharField(max_length=100)
    vendor_sku = models.CharField(max_length=100)
    upc = models.CharField(max_length=100, default="", blank=True)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="products_aliases"
    )
    retailer = models.ForeignKey(
        Retailer, on_delete=models.CASCADE, related_name="retailer_products_aliases"
    )
    availability = models.CharField(
        max_length=255,
        choices=QueueAvailability.choices,
        default=QueueAvailability.Available,
    )
    sku_quantity = models.IntegerField(default=1)
    is_live_data = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
