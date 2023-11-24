from django.db import models

from selleraxis.core.base_model import NoteModel
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder


class RetailerPurchaseOrderNote(NoteModel):
    order = models.ForeignKey(
        RetailerPurchaseOrder, related_name="notes", on_delete=models.CASCADE
    )
