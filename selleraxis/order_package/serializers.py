from drf_yasg import openapi
from rest_framework import serializers

from selleraxis.boxes.serializers import BoxSerializer
from selleraxis.core.serializers import BulkUpdateModelSerializer
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.models import OrderPackage
from selleraxis.retailer_purchase_order_items.serializers import (
    RetailerPurchaseOrderItemSerializer,
)
from selleraxis.retailer_purchase_orders.serializers import (
    RetailerPurchaseOrderSerializer,
)
from selleraxis.shipments.serializers import ShipmentSerializerShow


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
    shipment_packages = serializers.SerializerMethodField()

    def get_shipment_packages(self, instance) -> dict:
        list_shipment_packages = instance.shipment_packages.all()
        serializer = ShipmentSerializerShow(list_shipment_packages, many=True)
        return serializer.data

    class Meta:
        model = OrderPackage
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class AddPackageSerializer(serializers.Serializer):
    order_item = serializers.IntegerField(required=True)
    box = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(required=True)


class BulkUpdateOrderPackageSerializer(BulkUpdateModelSerializer):
    def validate(self, data):
        return data

    class Meta:
        model = OrderPackage
        fields = (
            "id",
            "length",
            "width",
            "height",
            "dimension_unit",
            "weight",
            "weight_unit",
        )

        swagger_schema_fields = {
            "type": openapi.TYPE_OBJECT,
            "title": "BulkUpdateProductAlias",
            "properties": {
                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                "length": openapi.Schema(type=openapi.TYPE_INTEGER),
                "width": openapi.Schema(type=openapi.TYPE_INTEGER),
                "height": openapi.Schema(type=openapi.TYPE_INTEGER),
                "dimension_unit": openapi.Schema(type=openapi.TYPE_STRING),
                "weight": openapi.Schema(type=openapi.TYPE_INTEGER),
                "weight_unit": openapi.Schema(type=openapi.TYPE_STRING),
            },
            "required": ["id"],
        }


class ItemOrderPackageSerializer(serializers.Serializer):
    order_item = serializers.IntegerField(required=True)
    quantity = serializers.IntegerField(required=True)


class BulkCreateOrderPackageSerializer(serializers.ModelSerializer):
    items = ItemOrderPackageSerializer(many=True, write_only=True)

    class Meta:
        model = OrderPackage
        fields = ("box", "items")
