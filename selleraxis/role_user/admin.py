from django.contrib import admin

from selleraxis.role_user.models import RoleUser


@admin.register(RoleUser)
class RoleUserAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "role", "created_at", "updated_at")
    search_fields = ("user", "role")
    ordering = ("user", "role")
