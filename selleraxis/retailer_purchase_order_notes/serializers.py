from rest_framework import serializers
from rest_framework.exceptions import ParseError

from selleraxis.retailer_purchase_order_notes.models import RetailerPurchaseOrderNote
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.users.serializers import UserSerializer


class ReadRetailerPurchaseOrderNoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RetailerPurchaseOrderNote
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class RetailerPurchaseOrderNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerPurchaseOrderNote
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class CreateUpdateNoteSerializer(serializers.Serializer):
    order = serializers.IntegerField(required=True)
    details = serializers.CharField()

    def validate_order(self, data):
        organization_id = self.context.get("view").request.headers.get("organization")
        try:
            RetailerPurchaseOrder.objects.get(
                pk=data, batch__retailer__organization_id=organization_id
            )
        except Exception:
            raise ParseError("Order id does not exists in organization")
        return data
