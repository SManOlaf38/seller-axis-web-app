from rest_framework import serializers
from rest_framework.exceptions import ParseError

from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.users.serializers import UserSerializer

from .models import RetailerPurchaseOrderReturnNote


class ReadRetailerPurchaseOrderReturnNoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RetailerPurchaseOrderReturnNote
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "user": {"read_only": True},
        }


class RetailerPurchaseOrderReturnNoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RetailerPurchaseOrderReturnNote
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "user": {"read_only": True},
        }


class DeteleUpdateRetailerPurchaseOrderReturnNoteSerializer(
    serializers.ModelSerializer
):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RetailerPurchaseOrderReturnNote
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "user": {"read_only": True},
        }

    def validate_order(self, order_return):
        organization_id = self.context.get("view").request.headers.get("organization")
        try:
            RetailerPurchaseOrder.objects.get(
                pk=order_return.order_id,
                order__batch__retailer__organization_id=organization_id,
            )
        except Exception:
            raise ParseError("Order id does not exists in organization")
        return order_return


class CustomRetailerPurchaseOrderReturnNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerPurchaseOrderReturnNote
        exclude = ("order_return",)
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "user": {"read_only": True},
        }

    def validate_order(self, order_return):
        organization_id = self.context.get("view").request.headers.get("organization")
        try:
            RetailerPurchaseOrder.objects.get(
                pk=order_return.order_id,
                order__batch__retailer__organization_id=organization_id,
            )
        except Exception:
            raise ParseError("Order id does not exists in organization")
        return order_return


class UpdateRetailerPurchaseOrderReturnNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerPurchaseOrderReturnNote
        exclude = ("order_return",)
        extra_kwargs = {
            "id": {"read_only": False},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "user": {"read_only": True},
        }

    def validate_order(self, order_return):
        organization_id = self.context.get("view").request.headers.get("organization")
        try:
            RetailerPurchaseOrder.objects.get(
                pk=order_return.order_id,
                order__batch__retailer__organization_id=organization_id,
            )
        except Exception:
            raise ParseError("Order id does not exists in organization")
        return order_return
