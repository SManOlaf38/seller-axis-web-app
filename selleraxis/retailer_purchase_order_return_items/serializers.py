from rest_framework import serializers

from selleraxis.product_alias.models import ProductAlias
from selleraxis.product_alias.serializers import SimpleProductAliasSerializer

from .models import RetailerPurchaseOrderReturnItem


class ReadRetailerPurchaseOrderReturnItemSerializer(serializers.ModelSerializer):
    product_alias = serializers.SerializerMethodField()

    def get_product_alias(
        self, instance: RetailerPurchaseOrderReturnItem
    ) -> dict | None:
        product_alias = (
            ProductAlias.objects.filter(
                merchant_sku=instance.item.merchant_sku,
                retailer_id=instance.item.order.batch.retailer_id,
            )
            .select_related("product")
            .last()
        )

        if product_alias:
            product_alias_serializer = SimpleProductAliasSerializer(product_alias)
            return product_alias_serializer.data
        return None

    class Meta:
        model = RetailerPurchaseOrderReturnItem
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }


class RetailerPurchaseOrderReturnItemSerializer(serializers.ModelSerializer):
    def validate(self, data):
        item = data.get("item")
        return_qty = data.get("return_qty")
        unbroken_qty = data.get("unbroken_qty")
        if return_qty > item.qty_ordered:
            raise serializers.ValidationError(
                "Return quantity must be less than ordered quantity."
            )

        elif unbroken_qty > return_qty:
            raise serializers.ValidationError(
                "Unbroken quantity must be less than return quantity."
            )

        return data

    class Meta:
        model = RetailerPurchaseOrderReturnItem
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }


class CustomRetailerPurchaseOrderReturnItemSerializer(serializers.ModelSerializer):
    def validate(self, data):
        item = data.get("item")
        return_qty = data.get("return_qty")
        unbroken_qty = data.get("unbroken_qty")
        if return_qty > item.qty_ordered:
            raise serializers.ValidationError(
                "Return quantity must be less than ordered quantity."
            )

        elif unbroken_qty > return_qty:
            raise serializers.ValidationError(
                "Unbroken quantity must be less than return quantity."
            )

        return data

    class Meta:
        model = RetailerPurchaseOrderReturnItem
        exclude = ("order_return",)
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
        }
