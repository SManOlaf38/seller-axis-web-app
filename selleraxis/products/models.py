from django.db import models

from selleraxis.product_series.models import ProductSeries


class Product(models.Model):
    WEIGHT_UNIT = (
        ("LB", "lb"),
        ("LBS", "lbs"),
        ("KG", "kg")
    )
    sku = models.CharField(max_length=100)
    unit_of_measure = models.CharField(max_length=100)
    available = models.CharField(max_length=100)
    upc = models.CharField(max_length=100)
    description = models.TextField()
    unit_cost = models.FloatField()
    qty_on_hand = models.IntegerField()
    qty_pending = models.IntegerField(default=0)
    qty_reserve = models.IntegerField()
    image = models.TextField()
    weight = models.FloatField(default=0)
    weight_unit = models.CharField(max_length=255, choices=WEIGHT_UNIT, default="lb")
    volume = models.FloatField(default=0)
    volume_unit = models.CharField(max_length=255, blank=True, default="")
    product_series = models.ForeignKey(
        ProductSeries,
        on_delete=models.CASCADE,
        null=True,
        related_name="products",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
