from django.contrib import admin

from selleraxis.retailer_participating_parties.models import RetailerParticipatingParty


@admin.register(RetailerParticipatingParty)
class RetailerParticipatingPartyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "retailer_participating_party_id",
        "name",
        "role_type",
        "participation_code",
        "retailer",
        "created_at",
        "updated_at",
    )
    search_fields = ("retailer_participating_party_id", "name", "retailer")
    ordering = ("retailer_participating_party_id", "retailer", "name", "created_at")
