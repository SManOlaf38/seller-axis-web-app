from rest_framework import serializers

from selleraxis.services.serializers import ServicesSerializer
from selleraxis.shipping_ref.models import ShippingRef


class ShippingRefSerializer(serializers.ModelSerializer):
    service = ServicesSerializer(read_only=True)

    class Meta:
        model = ShippingRef
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
