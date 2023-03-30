from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem


class RetailerPurchaseOrderItemSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["view"].request.headers.get("organization", None) != str(
            data["order"].batch.retailer.organization.id
        ):
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
