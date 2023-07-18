from drf_yasg import openapi
from rest_framework import serializers

from selleraxis.core.serializers import BulkUpdateModelSerializer

from .models import ProductWarehouseStaticData


class ProductWarehouseStaticDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductWarehouseStaticData
        fields = "__all__"


class BulkProductWarehouseStaticDataSerializer(BulkUpdateModelSerializer):
    class Meta:
        model = ProductWarehouseStaticData
        fields = (
            "id",
            "status",
            "qty_on_hand",
            "next_available_qty",
            "next_available_date",
            "product_warehouse_id",
        )
        read_only_fields = (
            "id",
            "retailer_warehouse_product",
        )

        swagger_schema_fields = {
            "type": openapi.TYPE_OBJECT,
            "title": "BulkUpdateProductAlias",
            "properties": {
                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                "status": openapi.Schema(type=openapi.TYPE_STRING),
                "qty_on_hand": openapi.Schema(type=openapi.TYPE_INTEGER),
                "next_available_qty": openapi.Schema(type=openapi.TYPE_INTEGER),
                "next_available_date": openapi.Schema(type=openapi.TYPE_STRING),
                "product_warehouse_id": openapi.Schema(type=openapi.TYPE_INTEGER),
            },
            "required": ["id"],
        }
