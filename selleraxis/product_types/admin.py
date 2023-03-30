from django.contrib import admin

from selleraxis.product_types.models import ProductType


@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "organization",
        "created_at",
        "updated_at",
    )
    search_fields = ("name", "organization")
    ordering = ("organization", "name", "created_at")
