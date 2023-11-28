from rest_framework import serializers

from selleraxis.getting_order_histories.models import GettingOrderHistory


class GettingOrderHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GettingOrderHistory
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
