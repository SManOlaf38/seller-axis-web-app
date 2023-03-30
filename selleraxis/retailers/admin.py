from django.contrib import admin

from selleraxis.retailers.models import Retailer


@admin.register(Retailer)
class RetailerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
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
        "organization",
        "created_at",
        "updated_at",
    )
    search_fields = ("name", "organization")
    ordering = ("organization", "name", "created_at")
