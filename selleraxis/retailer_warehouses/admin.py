from django.contrib import admin

from selleraxis.retailer_warehouses.models import RetailerWarehouse


@admin.register(RetailerWarehouse)
class ProductAliasAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "description",
        "address_1",
        "address_2",
        "city",
        "state",
        "postal_code",
        "country",
        "phone",
        "organization",
        "created_at",
        "updated_at",
    )
