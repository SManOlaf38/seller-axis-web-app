from django.contrib import admin

from selleraxis.retailer_person_places.models import RetailerPersonPlace


@admin.register(RetailerPersonPlace)
class RetailerPersonPlaceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "retailer_person_place_id",
        "name",
        "company",
        "address_rate_class",
        "address_1",
        "address_2",
        "city",
        "state",
        "country",
        "postal_code",
        "day_phone",
        "night_phone",
        "partner_person_place_id",
        "email",
        "retailer",
        "created_at",
        "updated_at",
    )
    search_fields = ("retailer_person_place_id", "name", "retailer")
    ordering = ("retailer_person_place_id", "retailer", "name", "created_at")
