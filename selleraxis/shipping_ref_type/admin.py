from django.contrib import admin

from selleraxis.shipping_ref_type.models import ShippingRefType


@admin.register(ShippingRefType)
class ShippingRefTypeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "data_field", "created_at", "updated_at")
