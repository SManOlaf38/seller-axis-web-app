from rest_framework import serializers

from selleraxis.services.models import Services


class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        exclude = ("general_client_id", "general_client_secret")
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
