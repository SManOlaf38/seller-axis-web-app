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
        fields = "__all__"
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
    product_warehouse_statices = ProductWarehouseStaticDataSerializer(
        read_only=True, many=True
    )
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

    def to_representation(self, obj):
        data = super(ReadRetailerWarehouseProductSerializer, self).to_representation(
            obj
        )
        if len(data["product_warehouse_statices"]) > 0:
            data["product_warehouse_statices"] = data["product_warehouse_statices"][0]
        else:
            data["product_warehouse_statices"] = None
        return data
