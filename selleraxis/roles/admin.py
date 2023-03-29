from django.contrib import admin

from selleraxis.roles.models import Role


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "permissions",
        "organization",
        "created_at",
        "updated_at",
    )
    search_fields = ("name", "organization")
    ordering = ("organization",)
