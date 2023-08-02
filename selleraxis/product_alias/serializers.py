from drf_yasg import openapi
from rest_framework import exceptions, serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.core.serializers import BulkUpdateModelSerializer
from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.serializers import ProductSerializer
from selleraxis.retailer_warehouse_products.serializers import (
    ReadRetailerWarehouseProductSerializer,
)


class ProductAliasSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if "product" in data and str(data["retailer"].organization.id) != str(
            data["product"].product_series.organization.id
        ):
            raise exceptions.ParseError("Product must is of retailer!")
        return data

    class Meta:
        model = ProductAlias
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=ProductAlias.objects.all(),
                fields=["merchant_sku", "retailer"],
            )
        ]


class BulkUpdateProductAliasSerializer(BulkUpdateModelSerializer):
    def validate(self, data):
        return data

    class Meta:
        model = ProductAlias
        fields = (
            "id",
            "sku",
            "merchant_sku",
            "vendor_sku",
            "sku_quantity",
            "is_live_data",
            "product_id",
            "retailer_id",
        )

        swagger_schema_fields = {
            "type": openapi.TYPE_OBJECT,
            "title": "BulkUpdateProductAlias",
            "properties": {
                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                "sku": openapi.Schema(type=openapi.TYPE_STRING),
                "merchant_sku": openapi.Schema(type=openapi.TYPE_STRING),
                "vendor_sku": openapi.Schema(type=openapi.TYPE_STRING),
                "sku_quantity": openapi.Schema(type=openapi.TYPE_INTEGER),
                "is_live_data": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                "product_id": openapi.Schema(title="sku", type=openapi.TYPE_INTEGER),
                "retailer_id": openapi.Schema(title="sku", type=openapi.TYPE_INTEGER),
            },
            "required": ["id"],
        }


class ReadProductAliasDataSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    retailer_warehouse_products = ReadRetailerWarehouseProductSerializer(
        many=True, read_only=True
    )

    class Meta:
        model = ProductAlias
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


from selleraxis.retailers.serializers import (  # noqa
    ReadRetailerSerializerShow,
    RetailerSerializer,
)


class ReadProductAliasSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    retailer = ReadRetailerSerializerShow(read_only=True)
    retailer_warehouse_products = ReadRetailerWarehouseProductSerializer(
        many=True, read_only=True
    )

    class Meta:
        model = ProductAlias
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
