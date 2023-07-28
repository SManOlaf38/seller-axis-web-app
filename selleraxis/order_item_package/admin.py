from django.contrib import admin

from selleraxis.order_item_package.models import OrderItemPackage


@admin.register(OrderItemPackage)
class OrderItemPackageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "quantity",
        "package_id",
        "order_item_id",
        "created_at",
        "updated_at",
    )
