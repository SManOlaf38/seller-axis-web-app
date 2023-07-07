from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.retailer_warehouse_products.models import RetailerWarehouseProduct


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
