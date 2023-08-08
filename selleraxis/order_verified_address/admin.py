from django.contrib import admin

from .models import OrderVerifiedAddress


@admin.register(OrderVerifiedAddress)
class OrderVerifiedAddressAdmin(admin.ModelAdmin):
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
        "created_at",
        "updated_at",
    )
