from django.db import models

from selleraxis.core.base_model import NoteModel
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.users.models import User


class RetailerPurchaseOrderNote(NoteModel):
    user = models.ForeignKey(
        User, related_name="purchase_order_note_from", on_delete=models.CASCADE
    )
    order = models.ForeignKey(
        RetailerPurchaseOrder, related_name="notes", on_delete=models.CASCADE
    )
