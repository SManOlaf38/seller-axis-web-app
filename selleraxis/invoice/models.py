from django.db import models

from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.services.models import Services


class Invoice(models.Model):
    doc_number = models.CharField(max_length=100, null=True)
    invoice_id = models.CharField(max_length=100, null=True)
    order = models.OneToOneField(
        RetailerPurchaseOrder, on_delete=models.CASCADE, related_name="invoice_order"
    )
    service = models.ForeignKey(
        Services, on_delete=models.CASCADE, related_name="invoice_service", null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
