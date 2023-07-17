from django.contrib import admin

from selleraxis.retailers.models import Retailer


@admin.register(Retailer)
class RetailerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "type",
        "organization",
        "created_at",
        "updated_at",
    )
    search_fields = ("name", "organization")
    ordering = ("organization", "name", "created_at")
