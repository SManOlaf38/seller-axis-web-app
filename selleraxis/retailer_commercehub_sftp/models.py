from django.db import models

from selleraxis.retailers.models import Retailer


class RetailerCommercehubSFTP(models.Model):
    sftp_host = models.CharField(max_length=225)
    sftp_username = models.CharField(max_length=225)
    sftp_password = models.CharField(max_length=128)
    purchase_orders_sftp_directory = models.CharField(
        max_length=225, blank=True, default=""
    )
    acknowledgment_sftp_directory = models.CharField(
        max_length=225, blank=True, default=""
    )
    confirm_sftp_directory = models.CharField(max_length=225, blank=True, default="")
    inventory_sftp_directory = models.CharField(max_length=225, blank=True, default="")
    invoice_sftp_directory = models.CharField(max_length=225, blank=True, default="")
    return_sftp_directory = models.CharField(max_length=225, blank=True, default="")
    payment_sftp_directory = models.CharField(max_length=225, blank=True, default="")
    retailer = models.ForeignKey(Retailer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
