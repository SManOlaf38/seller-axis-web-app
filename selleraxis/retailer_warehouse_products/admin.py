from django.contrib import admin

from selleraxis.retailer_warehouse_products.models import RetailerWarehouseProduct


@admin.register(RetailerWarehouseProduct)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "product_alias",
        "retailer_warehouse",
        "created_at",
        "updated_at",
    )
