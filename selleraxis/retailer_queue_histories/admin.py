from django.contrib import admin

from .models import RetailerQueueHistory


@admin.register(RetailerQueueHistory)
class RetailerQueueHistoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "status",
        "retailer",
        "result_url",
        "created_at",
        "updated_at",
    )
