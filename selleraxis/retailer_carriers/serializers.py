from rest_framework import serializers

from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailers.serializers import RetailerSerializer
from selleraxis.services.serializers import ServicesSerializer


class RetailerCarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerCarrier
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadRetailerCarrierSerializer(serializers.ModelSerializer):
    service = ServicesSerializer(read_only=True)
    retailer = RetailerSerializer(read_only=True)

    class Meta:
        model = RetailerCarrier
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
