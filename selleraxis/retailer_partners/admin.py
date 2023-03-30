from django.contrib import admin

from selleraxis.retailer_partners.models import RetailerPartner


@admin.register(RetailerPartner)
class RetailerPartnerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "retailer_partner_id",
        "name",
        "role_type",
        "retailer",
        "created_at",
        "updated_at",
    )
    search_fields = ("retailer_partner_id", "name", "retailer")
    ordering = ("retailer_partner_id", "retailer", "name", "created_at")
