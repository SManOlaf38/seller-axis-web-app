from rest_framework import serializers

from selleraxis.boxes.serializers import BoxSerializer
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.models import OrderPackage
from selleraxis.retailer_purchase_order_items.serializers import (
    RetailerPurchaseOrderItemSerializer,
)
from selleraxis.retailer_purchase_orders.serializers import (
    RetailerPurchaseOrderSerializer,
)


class OrderPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderPackage
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class OrderItemPackageSerializerShow(serializers.ModelSerializer):
    retailer_purchase_order_item = serializers.SerializerMethodField()

    def get_retailer_purchase_order_item(self, instance: OrderItemPackage) -> dict:
        serializer = RetailerPurchaseOrderItemSerializer(instance.order_item)
        return serializer.data

    class Meta:
        model = OrderItemPackage
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadOrderPackageSerializer(serializers.ModelSerializer):
    order = RetailerPurchaseOrderSerializer(read_only=True)
    box = BoxSerializer(read_only=True)
    order_item_packages = OrderItemPackageSerializerShow(many=True, read_only=True)

    class Meta:
        model = OrderPackage
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class AddPackageSerializer(serializers.Serializer):
    po_item_id = serializers.CharField(max_length=100)
    box_id = serializers.CharField(max_length=100)
    qty = serializers.IntegerField(default=0)
