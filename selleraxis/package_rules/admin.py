from django.contrib import admin

from selleraxis.package_rules.models import PackageRule


@admin.register(PackageRule)
class PackageRuleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "box_sizes",
        "organization",
        "created_at",
        "updated_at",
    )
    search_fields = ("name", "organization")
    ordering = ("organization", "name", "created_at")
