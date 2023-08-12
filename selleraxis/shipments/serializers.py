from rest_framework import serializers

from selleraxis.retailer_carriers.serializers import RetailerCarrierSerializer
from selleraxis.shipments.models import Shipment
from selleraxis.shipping_service_types.serializers import (
    ShippingServiceTypeSerializerShow,
)


class ShipmentSerializer(serializers.ModelSerializer):
    type = ShippingServiceTypeSerializerShow(read_only=True)
    carrier = RetailerCarrierSerializer(read_only=True)

    class Meta:
        model = Shipment
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ShipmentSerializerShow(serializers.ModelSerializer):
    type = ShippingServiceTypeSerializerShow(read_only=True)

    class Meta:
        model = Shipment
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
