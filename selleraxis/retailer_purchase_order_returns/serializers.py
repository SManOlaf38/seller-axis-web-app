from rest_framework import serializers

from selleraxis.retailer_purchase_order_return_items.serializers import (
    CustomRetailerPurchaseOrderReturnItemSerializer,
    ReadRetailerPurchaseOrderReturnItemSerializer,
)
from selleraxis.retailer_purchase_order_return_notes.serializers import (
    CustomRetailerPurchaseOrderReturnNoteSerializer,
    ReadRetailerPurchaseOrderReturnNoteSerializer,
)
from selleraxis.retailer_warehouses.serializers import ReadRetailerWarehouseSerializer

from .models import RetailerPurchaseOrderReturn


class ReadRetailerPurchaseOrderReturnSerializer(serializers.ModelSerializer):
    notes = ReadRetailerPurchaseOrderReturnNoteSerializer(many=True)
    order_returns_items = ReadRetailerPurchaseOrderReturnItemSerializer(many=True)
    warehouse = ReadRetailerWarehouseSerializer()

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


class UpdateRetailerPurchaseOrderReturnSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerPurchaseOrderReturn
        fields = ("is_dispute", "dispute_date")
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }
