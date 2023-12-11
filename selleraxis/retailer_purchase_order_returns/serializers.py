from rest_framework import serializers

from selleraxis.retailer_purchase_order_return_items.models import (
    RetailerPurchaseOrderReturnItem,
)
from selleraxis.retailer_purchase_order_return_items.serializers import (
    CustomRetailerPurchaseOrderReturnItemSerializer,
    ReadRetailerPurchaseOrderReturnItemSerializer,
)
from selleraxis.retailer_purchase_order_return_notes.models import (
    RetailerPurchaseOrderReturnNote,
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

    def get_return_items(self, obj):
        request = self.context.get("request")
        organization_id = request.headers.get("organization") if request else None

        return_items = RetailerPurchaseOrderReturnItem.objects.filter(
            order_return__order__batch__retailer__organization_id=organization_id,
            order_return=obj,
        )
        return ReadRetailerPurchaseOrderReturnItemSerializer(
            return_items, many=True, context=self.context
        ).data

    def get_return_notes(self, obj):
        request = self.context.get("request")
        organization_id = request.headers.get("organization") if request else None

        return_notes = RetailerPurchaseOrderReturnNote.objects.filter(
            order_return__order__batch__retailer__organization_id=organization_id,
            order_return=obj,
        )
        return ReadRetailerPurchaseOrderReturnNoteSerializer(
            return_notes, many=True, context=self.context
        ).data


class RetailerPurchaseOrderReturnSerializer(serializers.ModelSerializer):
    notes = CustomRetailerPurchaseOrderReturnNoteSerializer(many=True)
    order_returns_items = CustomRetailerPurchaseOrderReturnItemSerializer(many=True)

    class Meta:
        model = RetailerPurchaseOrderReturn
        fields = "__all__"
        extra_kwargs = {
            "notes": {"read_only": True},
            "order_returns_items": {"read_only": True},
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }
