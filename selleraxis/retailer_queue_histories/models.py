from django.db import models
from django.utils.translation import gettext_lazy as _

from selleraxis.retailers.models import Retailer


class RetailerQueueHistory(models.Model):
    class Label(models.TextChoices):
        ACKNOWLEDGMENT = "ACKNOWLEDGMENT", _("ACKNOWLEDGMENT")
        CONFIRM = "CONFIRM", _("CONFIRM")
        INVENTORY = "INVENTORY", _("INVENTORY")
        INVOICE = "INVOICE", _("INVOICE")
        RETURN = "RETURN", _("RETURN")
        PAYMENT = "PAYMENT", _("PAYMENT")

    class Status(models.TextChoices):
        PENDING = "PENDING", _("PENDING")
        COMPLETED = "COMPLETED", _("COMPLETED")
        NOT_FOUND = "NOT_FOUND", _("NOT_FOUND")
        FAILED = "FAILED", _("FAILED")

    type = models.CharField(max_length=255, blank=True, default=None)
    status = models.CharField(
        max_length=255, choices=Status.choices, default=Status.NOT_FOUND
    )
    label = models.CharField(
        max_length=255, choices=Label.choices, default=Label.INVENTORY
    )
    retailer = models.ForeignKey(
        Retailer, on_delete=models.CASCADE, related_name="retailer_queue_history"
    )
    result_url = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
