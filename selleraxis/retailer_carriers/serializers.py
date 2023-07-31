from rest_framework import serializers

from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailer_shippers.models import RetailerShipper
from selleraxis.retailers.serializers import RetailerSerializer
from selleraxis.services.serializers import ServicesSerializer


class RetailerShipperSerializerShow(serializers.ModelSerializer):
    class Meta:
        model = RetailerShipper
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class RetailerCarrierSerializer(serializers.ModelSerializer):
    shipper = RetailerShipperSerializerShow(read_only=True)

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
