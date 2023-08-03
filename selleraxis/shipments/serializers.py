from rest_framework import serializers

from selleraxis.shipments.models import Shipment


class ShipmentSerializer(serializers.Serializer):
    carrier_id = serializers.CharField(max_length=155)
    retailer_person_place_id = serializers.CharField(max_length=155)


class ShipmentSerializerShow(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
