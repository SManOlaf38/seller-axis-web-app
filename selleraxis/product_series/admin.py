from django.contrib import admin

from .models import ProductSeries


@admin.register(ProductSeries)
class ProductSeriesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "series",
        "organization",
        "created_at",
        "updated_at",
    )
