from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _

from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.retailer_warehouses.models import RetailerWarehouse


class Status(models.TextChoices):
    Return_opened = "Return opened", _("Return opened")
    Return_receive = "Return receive", _("Return receive")


class DiputeStatus(models.TextChoices):
    Requested = "Dispute requested", _("Dispute requested")
    Denied = "Dispute denied", _("Dispute denied")
    Reimbursed = "Dispute reimbursed", _("Dispute reimbursed")


class DisputeResult(models.TextChoices):
    REFUNDED_NOT_RETURNED = "REFUNDED_NOT_RETURNED"
    REFUNDED_AFTER_RETURN = "REFUNDED_AFTER_RETURN"
    REJECTED_FULL_PAYMENT = "REJECTED_FULL_PAYMENT"
    REJECTED_RETURN_SHIP = "REJECTED_RETURN_SHIP"
    REFUNDED_BOTH_PARTIES = "REFUNDED_BOTH_PARTIES"


class RetailerPurchaseOrderReturn(models.Model):
    order = models.ForeignKey(
        RetailerPurchaseOrder, related_name="order_returns", on_delete=models.CASCADE
    )
    status = models.CharField(
        max_length=100, choices=Status.choices, null=True, default=Status.Return_opened
    )
    dispute_id = models.CharField(max_length=100, blank=True, null=True)
    dispute_at = models.DateTimeField(null=True)
    updated_dispute_at = models.DateTimeField(null=True)
    dispute_status = models.CharField(
        max_length=100, choices=DiputeStatus.choices, null=True, default=None
    )
    dispute_reason = models.CharField(max_length=255, blank=True, null=True)
    dispute_result = models.CharField(
        max_length=100, choices=DisputeResult.choices, null=True, default=None
    )
    tracking_number = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        null=True,
    )
    service = models.CharField(max_length=255, blank=True, null=True)
    reimbursed_amount = models.DecimalField(
        max_digits=11, decimal_places=2, null=True
    )  # max 999999999.99
    warehouse = models.ForeignKey(
        RetailerWarehouse, related_name="warehouse_returns", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
