from django.contrib import admin

from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem


@admin.register(RetailerPurchaseOrderItem)
class RetailerPurchaseOrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "retailer_purchase_order_item_id",
        "order_line_number",
        "merchant_line_number",
        "qty_ordered",
        "unit_of_measure",
        "upc",
        "description",
        "description_2",
        "merchant_sku",
        "vendor_sku",
        "unit_cost",
        "shipping_code",
        "expected_ship_date",
        "po_line_data",
        "order",
        "created_at",
        "updated_at",
    )
    search_fields = ("retailer_purchase_order_item_id", "order")
    ordering = ("retailer_purchase_order_item_id", "order", "created_at")
