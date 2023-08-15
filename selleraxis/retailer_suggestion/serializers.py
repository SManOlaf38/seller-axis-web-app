from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.retailer_suggestion.models import RetailerSuggestion


class RetailerSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerSuggestion
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

        validators = [
            UniqueTogetherValidator(
                queryset=RetailerSuggestion.objects.all(),
                fields=["type", "merchant_id"],
            )
        ]
