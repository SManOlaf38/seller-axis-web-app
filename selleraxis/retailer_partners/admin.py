from django.contrib import admin

from selleraxis.retailer_partners.models import RetailerPartner


@admin.register(RetailerPartner)
class RetailerPartnerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "role_type",
        "retailer",
        "created_at",
        "updated_at",
    )
    search_fields = ("name", "retailer")
    ordering = ("retailer", "name", "created_at")
