from django.contrib import admin

from selleraxis.retailer_order_batchs.models import RetailerOrderBatch


@admin.register(RetailerOrderBatch)
class RetailerOrderBatchAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "batch_number",
        "partner",
        "retailer",
        "created_at",
        "updated_at",
    )
    search_fields = ("batch_number", "retailer")
    ordering = ("retailer", "batch_number", "created_at")
