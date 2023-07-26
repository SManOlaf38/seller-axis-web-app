from rest_framework import serializers


class ShipmentSerializer(serializers.Serializer):
    carrier_id = serializers.CharField(max_length=155)
    retailer_person_place_id = serializers.CharField(max_length=155)
