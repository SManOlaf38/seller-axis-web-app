from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.retailer_order_batchs.serializers import RetailerOrderBatchSerializer
from selleraxis.retailer_participating_parties.serializers import (
    RetailerParticipatingPartySerializer,
)
from selleraxis.retailer_person_places.serializers import RetailerPersonPlaceSerializer
from selleraxis.retailer_purchase_order_items.serializers import (
    RetailerPurchaseOrderItemSerializer,
)
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder


class RetailerPurchaseOrderSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["view"].request.headers.get("organization", None) != str(
            data["batch"].retailer.organization.id
        ):
            raise serializers.ValidationError("Batch must is in organization")

        if self.context["view"].request.headers.get("organization", None) != str(
            data["participating_party"].retailer.organization.id
        ):
            raise serializers.ValidationError(
                "Participating party must is in organization"
            )

        if self.context["view"].request.headers.get("organization", None) != str(
            data["ship_to"].retailer.organization.id
        ):
            raise serializers.ValidationError("Ship to address must is in organization")

        if self.context["view"].request.headers.get("organization", None) != str(
            data["bill_to"].retailer.organization.id
        ):
            raise serializers.ValidationError("Bill to address must is in organization")

        if self.context["view"].request.headers.get("organization", None) != str(
            data["invoice_to"].retailer.organization.id
        ):
            raise serializers.ValidationError(
                "Invoice to address must is in organization"
            )

        if self.context["view"].request.headers.get("organization", None) != str(
            data["customer"].retailer.organization.id
        ):
            raise serializers.ValidationError(
                "Customer address must is in organization"
            )

        return data

    class Meta:
        model = RetailerPurchaseOrder
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=RetailerPurchaseOrder.objects.all(),
                fields=["batch", "retailer_purchase_order_id"],
            )
        ]


class ReadRetailerPurchaseOrderSerializer(serializers.ModelSerializer):
    batch = RetailerOrderBatchSerializer(read_only=True)
    participating_party = RetailerParticipatingPartySerializer(read_only=True)
    ship_to = RetailerPersonPlaceSerializer(read_only=True)
    bill_to = RetailerPersonPlaceSerializer(read_only=True)
    invoice_to = RetailerPersonPlaceSerializer(read_only=True)
    customer = RetailerPersonPlaceSerializer(read_only=True)
    items = RetailerPurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = RetailerPurchaseOrder
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class AcknowledgeRetailerPurchaseOrderSerializer(ReadRetailerPurchaseOrderSerializer):
    pass
