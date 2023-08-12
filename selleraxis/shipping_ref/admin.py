from django.contrib import admin

from selleraxis.shipping_ref.models import ShippingRef


@admin.register(ShippingRef)
class ShippingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "code",
        "service",
        "created_at",
        "updated_at",
    )
