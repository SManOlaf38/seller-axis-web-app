from drf_yasg import openapi
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.core.serializers import BulkUpdateModelSerializer
from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.serializers import ProductSerializer
from selleraxis.retailer_queue_histories.serializers import (
    RetailerQueueHistorySerializer,
)
from selleraxis.retailer_suggestion.models import RetailerSuggestion
from selleraxis.retailer_warehouse_products.serializers import (
    ReadRetailerWarehouseProductSerializer,
)
from selleraxis.retailers.models import Retailer

from .exceptions import (
    MerchantSKUException,
    ProductAliasAPIException,
    UPCNumericException,
)

DEFAULT_RETAILER_TYPE = "CommerceHub"


class ProductAliasSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if "product" in data and str(data["retailer"].organization.id) != str(
            data["product"].product_series.organization.id
        ):
            raise ProductAliasAPIException("Product must is of retailer!")

        if "upc" in data and not str(data["upc"]).isnumeric():
            raise UPCNumericException

        retailer = data["retailer"]
        merchant_sku = str(data["merchant_sku"]).lower()
        if (
            str(retailer.type).lower() == DEFAULT_RETAILER_TYPE.lower()
            and len(merchant_sku) != 9
        ):
            raise MerchantSKUException

        retailer_suggestion = (
            RetailerSuggestion.objects.filter(
                type=retailer.type, merchant_id=retailer.merchant_id
            )
            .order_by("-created_at")
            .first()
        )

        if retailer_suggestion:
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
    retailer_queue_history = RetailerQueueHistorySerializer(read_only=True, many=True)

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

    class Meta:
        model = ProductAlias
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
