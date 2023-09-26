from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.retailer_carriers.serializers import ReadRetailerCarrierSerializer
from selleraxis.retailer_order_batchs.models import RetailerOrderBatch
from selleraxis.retailer_warehouses.serializers import ReadRetailerWarehouseSerializer
from selleraxis.retailers.models import Retailer
from selleraxis.shipping_ref_type.serializers import ShippingRefTypeSerializer


class RetailerOrderBatchSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if "retailer" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["retailer"].organization.id):
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


class RetailerSerializerShowOrderBatch(serializers.ModelSerializer):
    default_warehouse = ReadRetailerWarehouseSerializer(read_only=True)
    default_carrier = ReadRetailerCarrierSerializer(read_only=True)
    shipping_ref_1_type = ShippingRefTypeSerializer(read_only=True)
    shipping_ref_2_type = ShippingRefTypeSerializer(read_only=True)
    shipping_ref_3_type = ShippingRefTypeSerializer(read_only=True)
    shipping_ref_4_type = ShippingRefTypeSerializer(read_only=True)
    shipping_ref_5_type = ShippingRefTypeSerializer(read_only=True)

    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadRetailerOrderBatchSerializer(serializers.ModelSerializer):
    retailer = RetailerSerializerShowOrderBatch(read_only=True)

    class Meta:
        model = RetailerOrderBatch
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
