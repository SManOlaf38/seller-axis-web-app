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
        damaged_qty = data.get("damaged_qty")
        sum_qty = return_qty + damaged_qty
        if sum_qty > item.qty_ordered:
            raise serializers.ValidationError(
                "The total returned quantity and damaged quantity \
                must be less than or equal to the order quantity."
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
        damaged_qty = data.get("damaged_qty")
        sum_qty = return_qty + damaged_qty
        if sum_qty > item.qty_ordered:
            raise serializers.ValidationError(
                "The total returned quantity and damaged quantity \
                must be less than or equal to the order quantity."
            )
        return data

    class Meta:
        model = RetailerPurchaseOrderReturnItem
        exclude = ("order_return",)
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }


class UpdateRetailerPurchaseOrderReturnItemSerializer(serializers.ModelSerializer):
    def validate(self, data):
        instance = RetailerPurchaseOrderReturnItem.objects.get(pk=data["id"])
        item = instance.item
        return_qty = data.get("return_qty")
        damaged_qty = data.get("damaged_qty")
        sum_qty = return_qty + damaged_qty
        if item and sum_qty > item.qty_ordered:
            raise serializers.ValidationError(
                "The total returned quantity and damaged quantity "
                "must be less than or equal to the order quantity."
            )
        return data

    class Meta:
        model = RetailerPurchaseOrderReturnItem
        exclude = ("order_return", "item")
        extra_kwargs = {
            "id": {"read_only": False},
            "organization": {"read_only": True},
        }
