from django.contrib import admin

from selleraxis.retailer_warehouses.models import RetailerWarehouse


@admin.register(RetailerWarehouse)
class ProductAliasAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "description",
        "address",
        "retailer",
        "created_at",
        "updated_at",
    )
