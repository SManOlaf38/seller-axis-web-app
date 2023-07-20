# Register your models here.
from django.contrib import admin

from selleraxis.products.models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "sku",
        "unit_of_measure",
        "available",
        "upc",
        "description",
        "unit_cost",
        "qty_on_hand",
        "qty_reserve",
        "image",
        "created_at",
        "updated_at",
    )
