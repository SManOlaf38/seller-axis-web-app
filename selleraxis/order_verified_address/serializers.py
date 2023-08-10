from rest_framework import serializers
from rest_framework.exceptions import ValidationError

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

    def validate(self, data):
        if "address_1" in data and not data["address_1"]:
            raise ValidationError(detail={"address_1": ["Address field is required"]})
        if "city" in data and not data["city"]:
            raise ValidationError({"city": ["City field is required"]})
        if "state" in data and not data["state"]:
            raise ValidationError({"state": ["State field is required"]})
        if "postal_code" in data and not data["postal_code"]:
            raise ValidationError({"postal_code": ["Postal code field is required"]})
        if "country" in data:
            if not data["country"]:
                raise ValidationError({"country": ["Country field is required"]})
            if len(data["country"]) != 2:
                raise ValidationError(
                    {"country": ["Country length field is required 2 letters"]}
                )
        if "phone" in data and not data["phone"]:
            raise ValidationError({"phone": ["Phone field is required"]})
        return data
