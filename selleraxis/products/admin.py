from django.contrib import admin

from selleraxis.products.models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "product_type",
        "vendor_merch_id",
        "title",
        "description",
        "main_image",
        "image_urls",
        "cost",
        "sale_price",
        "model_series",
        "master_sku",
        "package_rule",
        "child_sku",
        "upc",
        "sku_quantity",
        "weight",
        "weight_unit",
        "length",
        "width",
        "height",
        "dimension_unit",
        "barcode_size",
        "qbo_item_id",
        "commodity_code",
        "country_of_manufacture",
        "organization",
        "created_at",
        "updated_at",
    )
    search_fields = ("title", "child_sku", "master_sku", "organization")
    ordering = ("organization", "title", "child_sku", "master_sku", "created_at")
