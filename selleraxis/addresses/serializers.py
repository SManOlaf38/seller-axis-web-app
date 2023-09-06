from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from selleraxis.addresses.models import Address
from selleraxis.retailer_carriers.serializers import RetailerCarrierSerializer


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def validate(self, data):
        if "country" in data and len(data["country"]) != 2:
            raise ValidationError(
                {"country": ["Country length field is required 2 letters"]}
            )
        if (
            "status" in data
            and str(data["status"]).upper() not in Address.Status.values
        ):
            raise ValidationError(
                {
                    "status": [
                        "Status must be one of the following fields: %s"
                        % Address.Status.values
                    ]
                }
            )
        return data


class ReadAddressSerializer(serializers.ModelSerializer):
    verified_carrier = RetailerCarrierSerializer(read_only=True)

    class Meta:
        model = Address
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class CreateAddressSerializer(serializers.ModelSerializer):
    retailer_id = serializers.CharField(
        max_length=10, required=False, allow_blank=True, allow_null=True
    )

    class Meta:
        model = Address
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def validate(self, data):
        if "country" in data and len(data["country"]) != 2:
            raise ValidationError(
                {"country": ["Country length field is required 2 letters"]}
            )
        if (
            "status" in data
            and str(data["status"]).upper() not in Address.Status.values
        ):
            raise ValidationError(
                {
                    "status": [
                        "Status must be one of the following fields: %s"
                        % Address.Status.values
                    ]
                }
            )
        return data
