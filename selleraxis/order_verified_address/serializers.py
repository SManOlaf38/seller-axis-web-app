from rest_framework import serializers

from selleraxis.order_verified_address.models import OrderVerifiedAddress


class OrderVerifiedAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderVerifiedAddress
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
