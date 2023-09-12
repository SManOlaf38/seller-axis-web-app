from django.contrib import admin

from selleraxis.addresses.models import Address


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "company",
        "contact_name",
        "address_1",
        "address_2",
        "city",
        "state",
        "postal_code",
        "country",
        "phone",
        "email",
        "verified_carrier",
        "organization",
        "created_at",
        "updated_at",
    )
