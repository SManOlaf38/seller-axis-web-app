from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.retailer_order_batchs.models import RetailerOrderBatch


class RetailerOrderBatchSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["view"].request.headers.get("organization", None) != str(
            data["retailer"].organization.id
        ):
            raise serializers.ValidationError("Retailer must is in organization")

        if data["retailer"].id != data["partner"].retailer.id:
            raise serializers.ValidationError("Partner must is of retailer")

        return data

    class Meta:
        model = RetailerOrderBatch
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=RetailerOrderBatch.objects.all(),
                fields=["retailer", "batch_number"],
            )
        ]
