from rest_framework import exceptions, serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.serializers import ProductSerializer
from selleraxis.retailer_warehouse_products.serializers import (
    ReadRetailerWarehouseProductSerializer,
)


class ProductAliasSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if str(data["retailer"].organization.id) != str(
            data["product"].organization.id
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
                fields=["sku", "retailer"],
            )
        ]


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


from selleraxis.retailers.serializers import RetailerSerializer  # noqa


class ReadProductAliasSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    retailer = RetailerSerializer(read_only=True)
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
