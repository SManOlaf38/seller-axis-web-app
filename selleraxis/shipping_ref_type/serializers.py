from rest_framework import serializers

from selleraxis.shipping_ref_type.models import ShippingRefType


class ShippingRefTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingRefType
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
