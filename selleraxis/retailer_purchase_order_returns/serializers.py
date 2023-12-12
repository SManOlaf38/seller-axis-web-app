from rest_framework import serializers

from selleraxis.retailer_purchase_order_return_items.serializers import (
    CustomRetailerPurchaseOrderReturnItemSerializer,
    ReadRetailerPurchaseOrderReturnItemSerializer,
)
from selleraxis.retailer_purchase_order_return_notes.serializers import (
    CustomRetailerPurchaseOrderReturnNoteSerializer,
    ReadRetailerPurchaseOrderReturnNoteSerializer,
)

from .models import RetailerPurchaseOrderReturn


class ReadRetailerPurchaseOrderReturnSerializer(serializers.ModelSerializer):
    notes = ReadRetailerPurchaseOrderReturnNoteSerializer(many=True)
    order_returns_items = ReadRetailerPurchaseOrderReturnItemSerializer(many=True)

    class Meta:
        model = RetailerPurchaseOrderReturn
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }


class RetailerPurchaseOrderReturnSerializer(serializers.ModelSerializer):
    notes = CustomRetailerPurchaseOrderReturnNoteSerializer(many=True)
    order_returns_items = CustomRetailerPurchaseOrderReturnItemSerializer(many=True)

    class Meta:
        model = RetailerPurchaseOrderReturn
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }
