from rest_framework import serializers

from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.serializers import OrderPackageSerializer
from selleraxis.retailer_purchase_order_items.serializers import (
    RetailerPurchaseOrderItemSerializer,
)


class OrderItemPackageSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(required=True)

    class Meta:
        model = OrderItemPackage
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class UpdateOrderItemPackageSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(required=True)


class ReadOrderItemPackageSerializer(serializers.ModelSerializer):
    package = OrderPackageSerializer(read_only=True)
    order_item = RetailerPurchaseOrderItemSerializer(read_only=True)

    class Meta:
        model = OrderItemPackage
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
