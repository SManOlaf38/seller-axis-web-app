from django.contrib import admin

from selleraxis.getting_order_histories.models import GettingOrderHistory


@admin.register(GettingOrderHistory)
class GettingOrderHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "organization",
        "created_at",
        "updated_at",
    )
    ordering = ("organization", "created_at")
