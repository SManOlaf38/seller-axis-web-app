from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from selleraxis.addresses.models import Address
from selleraxis.gs1.models import GS1
from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailer_order_batchs.models import RetailerOrderBatch
from selleraxis.retailer_participating_parties.models import RetailerParticipatingParty
from selleraxis.retailer_person_places.models import RetailerPersonPlace


class QueueStatus(models.TextChoices):
    Opened = "Opened", _("Opened")
    Acknowledged = "Acknowledged", _("Acknowledged")
    Shipped = "Shipped", _("Shipped")
    Shipment_Confirmed = "Shipment Confirmed", _("Shipment Confirmed")
    Invoiced = "Invoiced", _("Invoiced")
    Invoice_Confirmed = "Invoice Confirmed", _("Invoice Confirmed")
    Cancelled = "Cancelled", _("Cancelled")
    Bypassed_Acknowledge = "Bypassed Acknowledge", _("Bypassed Acknowledge")
    Backorder = "Backorder", _("Backorder")


class RetailerPurchaseOrder(models.Model):
    retailer_purchase_order_id = models.CharField(max_length=255)
    transaction_id = models.CharField(max_length=255)
    participating_party = models.ForeignKey(
        RetailerParticipatingParty, on_delete=models.CASCADE, null=True
    )
    senders_id_for_receiver = models.CharField(max_length=255)
    po_number = models.CharField(max_length=255)
    order_date = models.DateTimeField(default=timezone.now)
    ship_to = models.ForeignKey(
        RetailerPersonPlace,
        related_name="ship_to_orders",
        on_delete=models.CASCADE,
        null=True,
    )
    ship_from = models.ForeignKey(
        Address,
        related_name="ship_from_orders",
        on_delete=models.CASCADE,
        null=True,
    )
    bill_to = models.ForeignKey(
        RetailerPersonPlace,
        related_name="bill_to_orders",
        on_delete=models.CASCADE,
        null=True,
    )
    invoice_to = models.ForeignKey(
        RetailerPersonPlace,
        related_name="invoice_to_orders",
        on_delete=models.CASCADE,
        null=True,
    )
    verified_ship_to = models.ForeignKey(
        Address,
        related_name="verified_ship_to_orders",
        on_delete=models.CASCADE,
        null=True,
    )
    customer = models.ForeignKey(
        RetailerPersonPlace,
        related_name="customer_orders",
        on_delete=models.CASCADE,
        null=True,
    )
    shipping_code = models.CharField(max_length=255)
    sales_division = models.CharField(max_length=255)
    vendor_warehouse_id = models.CharField(max_length=255)
    cust_order_number = models.CharField(max_length=255)
    po_hdr_data = models.JSONField()
    control_number = models.CharField(max_length=255)
    buying_contract = models.CharField(max_length=255)
    batch = models.ForeignKey(
        RetailerOrderBatch, on_delete=models.CASCADE, related_name="order_batch"
    )
    status = models.CharField(
        max_length=255, choices=QueueStatus.choices, default=QueueStatus.Opened
    )
    ship_date = models.DateTimeField(blank=True, null=True)
    declared_value = models.FloatField(default=0)
    carrier = models.ForeignKey(RetailerCarrier, null=True, on_delete=models.SET_NULL)
    shipping_service = models.CharField(max_length=255, null=True)
    shipping_ref_1 = models.CharField(max_length=255, default="")
    shipping_ref_2 = models.CharField(max_length=255, default="")
    shipping_ref_3 = models.CharField(max_length=255, default="")
    shipping_ref_4 = models.CharField(max_length=255, default="")
    shipping_ref_5 = models.CharField(max_length=255, default="")
    gs1 = models.ForeignKey(GS1, null=True, on_delete=models.SET_NULL)
    estimated_ship_date = models.DateTimeField(null=True)
    estimated_delivery_date = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    is_divide = models.BooleanField(default=False)
