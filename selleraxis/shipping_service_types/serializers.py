from rest_framework import serializers

from selleraxis.shipping_service_types.models import ShippingServiceType


class ShippingServiceTypeSerializerShow(serializers.ModelSerializer):
    class Meta:
        model = ShippingServiceType
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
