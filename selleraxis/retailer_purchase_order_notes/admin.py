from django.contrib import admin

from selleraxis.retailer_purchase_order_notes.models import RetailerPurchaseOrderNote


@admin.register(RetailerPurchaseOrderNote)
class RetailerPurchaseOrderNoteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "details",
        "order",
        "created_at",
        "updated_at",
    )
    search_fields = ("user", "order")
    ordering = ("user", "order", "created_at")
