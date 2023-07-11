from django.contrib import admin

from selleraxis.retailer_carriers.models import RetailerCarrier


@admin.register(RetailerCarrier)
class PackageRuleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "client_id",
        "client_secret",
        "service",
        "retailer",
        "created_at",
        "updated_at",
    )
