from django.contrib import admin

from selleraxis.order_package.models import OrderPackage


@admin.register(OrderPackage)
class OrderPackageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "box_id",
        "order_id",
        "created_at",
        "updated_at",
    )
