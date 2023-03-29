from django.contrib import admin

from selleraxis.organization_members.models import OrganizationMember


@admin.register(OrganizationMember)
class OrganizationMemberAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "role", "created_at", "updated_at")
    search_fields = ("user", "role")
    ordering = ("user", "role")
