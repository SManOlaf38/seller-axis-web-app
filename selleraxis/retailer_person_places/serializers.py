from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.retailer_person_places.models import RetailerPersonPlace


class RetailerPersonPlaceSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["view"].request.headers.get("organization", None) != str(
            data["retailer"].organization.id
        ):
            raise serializers.ValidationError("Retailer must is in organization")

        return data

    class Meta:
        model = RetailerPersonPlace
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=RetailerPersonPlace.objects.all(),
                fields=["retailer", "retailer_person_place_id"],
            )
        ]
