from django.contrib import admin

from selleraxis.qbo_unhandled_data.models import QBOUnhandledData


@admin.register(QBOUnhandledData)
class QBOUnhandledDataAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "model",
        "action",
        "object_id",
        "organization",
        "created_at",
        "updated_at",
    )
