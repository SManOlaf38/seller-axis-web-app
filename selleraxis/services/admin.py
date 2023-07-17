from django.contrib import admin

from selleraxis.services.models import Services


@admin.register(Services)
class ServicesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "type",
        "general_client_id",
        "general_client_secret",
        "created_at",
        "updated_at",
    )
