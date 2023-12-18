from django.db import models

from selleraxis.core.base_model import NoteModel
from selleraxis.retailer_purchase_order_returns.models import (
    RetailerPurchaseOrderReturn,
)
from selleraxis.users.models import User


class RetailerPurchaseOrderReturnNote(NoteModel):
    user = models.ForeignKey(
        User, related_name="purchase_order_return_note_from", on_delete=models.CASCADE
    )
    order_return = models.ForeignKey(
        RetailerPurchaseOrderReturn, related_name="notes", on_delete=models.CASCADE
    )
