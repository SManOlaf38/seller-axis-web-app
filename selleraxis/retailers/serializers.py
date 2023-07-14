from rest_framework import serializers

from selleraxis.product_alias.serializers import ReadProductAliasDataSerializer
from selleraxis.retailer_warehouses.serializers import RetailerWarehouseAliasSerializer
from selleraxis.retailers.models import Retailer


class RetailerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadRetailerSerializer(serializers.ModelSerializer):
    retailer_products_aliases = serializers.SerializerMethodField()
    retailer_warehouses = RetailerWarehouseAliasSerializer(many=True, read_only=True)

    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def get_retailer_products_aliases(self, obj):
        product_alias_serializer = ReadProductAliasDataSerializer(
            obj.retailer_products_aliases, many=True
        )
        return product_alias_serializer.data
