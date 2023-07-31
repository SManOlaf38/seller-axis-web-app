from rest_framework import serializers

from selleraxis.retailer_carriers.serializers import RetailerCarrierSerializer
from selleraxis.retailer_shippers.models import RetailerShipper


class RetailerShipperSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerShipper
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadRetailerShipperSerializer(serializers.ModelSerializer):
    retailer_carrier = RetailerCarrierSerializer(read_only=True)

    class Meta:
        model = RetailerShipper
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
