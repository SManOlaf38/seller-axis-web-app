from django.contrib import admin

from selleraxis.organizations.models import Organization


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_by", "created_at", "updated_at")
    search_fields = ("name",)
    ordering = ("name",)
