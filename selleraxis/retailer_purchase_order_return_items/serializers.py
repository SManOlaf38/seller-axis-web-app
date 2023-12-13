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
        if return_qty == 0 and damaged_qty == 0:
            raise serializers.ValidationError(
                "The total of damaged and return quantity cannot be both 0.\
                    At least one of them must be greater than 0."
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
        if return_qty == 0 and damaged_qty == 0:
            raise serializers.ValidationError(
                "The total of damaged and return quantity cannot be both 0.\
                    At least one of them must be greater than 0."
            )
        return data

    class Meta:
        model = RetailerPurchaseOrderReturnItem
        exclude = ("order_return",)
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }
