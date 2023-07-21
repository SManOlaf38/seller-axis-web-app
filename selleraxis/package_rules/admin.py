from django.contrib import admin

from selleraxis.package_rules.models import PackageRule


@admin.register(PackageRule)
class PackageRuleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "created_at",
        "updated_at",
    )
