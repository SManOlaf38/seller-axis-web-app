from rest_framework import serializers

from selleraxis.boxes.serializers import BoxSerializer
from selleraxis.order_package.models import OrderPackage
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


class ReadOrderPackageSerializer(serializers.ModelSerializer):
    order = RetailerPurchaseOrderSerializer(read_only=True)
    box = BoxSerializer(read_only=True)

    class Meta:
        model = OrderPackage
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
