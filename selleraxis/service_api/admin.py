from django.contrib import admin

from selleraxis.service_api.models import ServiceAPI


@admin.register(ServiceAPI)
class ServiceAPIAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "action",
        "sandbox_url",
        "production_url",
        "method",
        "body",
        "response",
        "service",
        "created_at",
        "updated_at",
    )
