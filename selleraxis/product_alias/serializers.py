from drf_yasg import openapi
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.core.serializers import BulkUpdateModelSerializer
from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.serializers import ProductSerializer
from selleraxis.retailer_suggestion.models import RetailerSuggestion
from selleraxis.retailer_warehouse_products.serializers import (
    ReadRetailerWarehouseProductSerializer,
)
from selleraxis.retailers.models import Retailer

from .exceptions import (
    MerchantSKUException,
    RetailerRequiredAPIException,
    SKUQuantityException,
    UPCNumericException,
    WarhouseNameIsNone,
)

DEFAULT_RETAILER_TYPE = "CommerceHub"


class ProductAliasSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if "product" in data and str(data["retailer"].organization.id) != str(
            data["product"].product_series.organization.id
        ):
            raise RetailerRequiredAPIException

        if "upc" in data and not str(data["upc"]).isnumeric():
            raise UPCNumericException

        retailer = data["retailer"]
        merchant_sku = str(data["merchant_sku"]).lower()
        retailer_suggestion = (
            RetailerSuggestion.objects.filter(
                type=retailer.type, merchant_id=retailer.merchant_id
            )
            .order_by("-created_at")
            .first()
        )

        if retailer_suggestion:
            if (
                retailer_suggestion.merchant_sku_min_length
                and len(merchant_sku) < retailer_suggestion.merchant_sku_min_length
            ):
                raise MerchantSKUException(
                    "Merchant SKU length must be greater than or equal to %s digits"
                    % retailer_suggestion.merchant_sku_min_length
                )

            if (
                retailer_suggestion.merchant_sku_max_length
                and len(merchant_sku) > retailer_suggestion.merchant_sku_max_length
            ):
                raise MerchantSKUException(
                    "Merchant SKU length must be small than or equal to %s digits"
                    % retailer_suggestion.merchant_sku_min_length
                )

            is_valid = False
            for prefix in retailer_suggestion.merchant_sku_prefix:
                if merchant_sku.startswith(str(prefix.lower())):
                    is_valid = True
                    break

            if not is_valid:
                raise MerchantSKUException(
                    "Merchant SKU must be start with: %s"
                    % retailer_suggestion.merchant_sku_prefix
                )

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
            ),
            UniqueTogetherValidator(
                queryset=ProductAlias.objects.all(),
                fields=["upc", "retailer"],
            ),
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
            "upc",
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
                "upc": openapi.Schema(type=openapi.TYPE_STRING),
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


class RetailerSerializerShowProduct(serializers.ModelSerializer):
    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadProductAliasSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    retailer = RetailerSerializerShowProduct(read_only=True)
    retailer_warehouse_products = ReadRetailerWarehouseProductSerializer(
        many=True, read_only=True
    )
    last_queue_history = serializers.CharField(max_length=255)

    class Meta:
        model = ProductAlias
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class BulkWarehouseProductSerializer(serializers.Serializer):
    warehouse_name = serializers.CharField(
        write_only=True, required=False, allow_null=True
    )
    qty_on_hand = serializers.IntegerField(
        write_only=True, required=False, allow_null=True
    )
    next_available_qty = serializers.IntegerField(
        write_only=True, required=False, allow_null=True
    )
    next_available_day = serializers.DateTimeField(
        write_only=True, required=False, allow_null=True
    )


class BulkCreateProductAliasSerializer(serializers.ModelSerializer):
    warehouse_array = BulkWarehouseProductSerializer(
        write_only=True, many=True, required=False
    )
    product_sku = serializers.CharField(write_only=True)
    retailer_merchant_id = serializers.CharField(write_only=True)
    retailer_name = serializers.CharField(write_only=True)
    sku_quantity = serializers.CharField(write_only=True)

    class Meta:
        model = ProductAlias
        fields = [
            "sku",
            "merchant_sku",
            "vendor_sku",
            "upc",
            "sku_quantity",
            "product_sku",
            "retailer_name",
            "retailer_merchant_id",
            "warehouse_array",
        ]

    def validate(self, data):
        if "sku_quantity" in data and not str(data["sku_quantity"]).isnumeric():
            raise SKUQuantityException
        warehouse_array = data.get("warehouse_array")
        for warehouse_item in warehouse_array:
            if warehouse_item["warehouse_name"] is None:
                raise WarhouseNameIsNone

        if "upc" in data and not str(data["upc"]).isnumeric():
            raise UPCNumericException
        return data


class ProductAliasInventorySerializer(serializers.Serializer):
    product_alias_ids = serializers.CharField(required=True)
