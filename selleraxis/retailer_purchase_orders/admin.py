from django.contrib import admin

from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder


@admin.register(RetailerPurchaseOrder)
class RetailerPurchaseOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "retailer_purchase_order_id",
        "transaction_id",
        "participating_party",
        "senders_id_for_receiver",
        "po_number",
        "order_date",
        "ship_to",
        "bill_to",
        "invoice_to",
        "customer",
        "shipping_code",
        "sales_division",
        "vendor_warehouse_id",
        "cust_order_number",
        "po_hdr_data",
        "control_number",
        "buying_contract",
        "batch",
        "created_at",
        "updated_at",
    )
    search_fields = ("retailer_purchase_order_id", "batch")
    ordering = ("retailer_purchase_order_id", "batch", "created_at")
