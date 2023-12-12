from rest_framework import serializers

from selleraxis.retailer_purchase_order_items.serializers import (
    RetailerPurchaseOrderItemSerializer,
)

from .models import RetailerPurchaseOrderReturnItem


class ReadRetailerPurchaseOrderReturnItemSerializer(serializers.ModelSerializer):
    item = RetailerPurchaseOrderItemSerializer(read_only=True)

    class Meta:
        model = RetailerPurchaseOrderReturnItem
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }


class RetailerPurchaseOrderReturnItemSerializer(serializers.ModelSerializer):
    def validate(self, data):
        item = data.get("item")
        return_qty = data.get("return_qty")
        unbroken_qty = data.get("unbroken_qty")
        if return_qty > item.qty_ordered:
            raise serializers.ValidationError(
                "Return quantity must be less than ordered quantity."
            )

        elif unbroken_qty > return_qty:
            raise serializers.ValidationError(
                "Unbroken quantity must be less than return quantity."
            )

        return data

    class Meta:
        model = RetailerPurchaseOrderReturnItem
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }


class CustomRetailerPurchaseOrderReturnItemSerializer(serializers.ModelSerializer):
    def validate(self, data):
        item = data.get("item")
        return_qty = data.get("return_qty")
        unbroken_qty = data.get("unbroken_qty")
        if return_qty > item.qty_ordered:
            raise serializers.ValidationError(
                "Return quantity must be less than ordered quantity."
            )

        elif unbroken_qty > return_qty:
            raise serializers.ValidationError(
                "Unbroken quantity must be less than return quantity."
            )

        return data

    class Meta:
        model = RetailerPurchaseOrderReturnItem
        exclude = ("order_return",)
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }
