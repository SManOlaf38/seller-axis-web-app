from django.db import models

from selleraxis.organizations.models import Organization


class Retailer(models.Model):
    name = models.CharField(max_length=255)
    sftp_host = models.CharField(max_length=255)
    sftp_username = models.CharField(max_length=255)
    sftp_password = models.CharField(max_length=255)
    purchase_orders_sftp_directory = models.CharField(max_length=255)
    acknowledgment_sftp_directory = models.CharField(max_length=255)
    confirm_sftp_directory = models.CharField(max_length=255)
    inventory_sftp_directory = models.CharField(max_length=255)
    invoice_sftp_directory = models.CharField(max_length=255)
    return_sftp_directory = models.CharField(max_length=255)
    payment_sftp_directory = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
