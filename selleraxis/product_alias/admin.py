from django.contrib import admin

from selleraxis.product_alias.models import ProductAlias


@admin.register(ProductAlias)
class ProductAliasAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "sku",
        "merchant_sku",
        "vendor_sku",
        "product",
        "retailer",
        "availability",
        "created_at",
        "updated_at",
    )
