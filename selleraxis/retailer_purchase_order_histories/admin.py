from django.contrib import admin

from .models import RetailerPurchaseOrderHistory


@admin.register(RetailerPurchaseOrderHistory)
class RetailerPurchaseOrderHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "status",
        "order",
        "queue_history",
        "created_at",
        "updated_at",
    )
