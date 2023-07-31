from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.product_alias.models import ProductAlias
from selleraxis.product_alias.serializers import ProductAliasSerializer
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem


class RetailerPurchaseOrderItemSerializer(serializers.ModelSerializer):
    product_alias = serializers.SerializerMethodField()

    def get_product_alias(self, instance: RetailerPurchaseOrderItem) -> dict | None:
        product_alias = ProductAlias.objects.filter(
            sku=instance.vendor_sku, retailer_id=instance.order.batch.retailer_id
        ).last()
        if product_alias:
            product_alias_serializer = ProductAliasSerializer(product_alias)
            return product_alias_serializer.data
        return None

    def validate(self, data):
        if "order" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["order"].batch.retailer.organization.id):
            raise serializers.ValidationError("Order must is of organization")

        return data

    class Meta:
        model = RetailerPurchaseOrderItem
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=RetailerPurchaseOrderItem.objects.all(),
                fields=["order", "retailer_purchase_order_item_id"],
            )
        ]


class CustomRetailerPurchaseOrderItemSerializer(RetailerPurchaseOrderItemSerializer):
    def get_product_alias(self, instance: RetailerPurchaseOrderItem) -> dict | None:
        if hasattr(instance, "product_alias") and isinstance(
            instance.product_alias, ProductAlias
        ):
            product_alias_serializer = ProductAliasSerializer(instance.product_alias)
            return product_alias_serializer.data
        return None
