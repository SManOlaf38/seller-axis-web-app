from django.contrib import admin

from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP


@admin.register(RetailerCommercehubSFTP)
class ProductAliasAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "sftp_host",
        "sftp_username",
        "sftp_password",
        "purchase_orders_sftp_directory",
        "acknowledgment_sftp_directory",
        "confirm_sftp_directory",
        "inventory_sftp_directory",
        "invoice_sftp_directory",
        "return_sftp_directory",
        "payment_sftp_directory",
        "retailer",
        "created_at",
        "updated_at",
    )
