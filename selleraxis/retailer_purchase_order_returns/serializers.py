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

    def validate_order_returns_items(self, value):
        all_qty = 0
        for return_item_data in value:
            return_item_qty = return_item_data.get("return_qty") + return_item_data.get(
                "damaged_qty"
            )
            all_qty += return_item_qty
        if all_qty == 0:
            raise serializers.ValidationError(
                "There must be at least 1 returned or damaged item in the entire return order "
            )
        return value

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
