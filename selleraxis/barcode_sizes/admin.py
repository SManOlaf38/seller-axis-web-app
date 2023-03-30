from django.contrib import admin

from selleraxis.barcode_sizes.models import BarcodeSize


@admin.register(BarcodeSize)
class BarcodeSizeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "width",
        "height",
        "multiple_per_label",
        "organization",
        "created_at",
        "updated_at",
    )
    search_fields = ("name", "organization")
    ordering = ("organization", "name", "created_at")
