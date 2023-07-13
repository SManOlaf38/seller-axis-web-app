from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.product_warehouse_static_data.serializers import (
    ProductWarehouseStaticDataSerializer,
)
from selleraxis.retailer_warehouse_products.models import RetailerWarehouseProduct
from selleraxis.retailer_warehouses.serializers import RetailerWarehouseAliasSerializer


class RetailerWarehouseProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerWarehouseProduct
        # fields = "__all__"
        fields = ["live_data"]
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=RetailerWarehouseProduct.objects.all(),
                fields=["product_alias", "retailer_warehouse"],
            )
        ]


class ReadRetailerWarehouseProductSerializer(serializers.ModelSerializer):
    product_warehouse_statices = ProductWarehouseStaticDataSerializer(read_only=True)
    retailer_warehouse = RetailerWarehouseAliasSerializer(read_only=True)
    live_data = serializers.IntegerField(source="product_alias.product.qty_on_hand")

    class Meta:
        model = RetailerWarehouseProduct
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
