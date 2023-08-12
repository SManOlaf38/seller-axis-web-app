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
        if "country" in data and len(data["country"]) != 2:
            raise ValidationError(
                {"country": ["Country length field is required 2 letters"]}
            )
        if (
            "status" in data
            and str(data["status"]).upper() not in OrderVerifiedAddress.Status.values
        ):
            raise ValidationError(
                {
                    "status": [
                        "Status must be one of the following fields: %s"
                        % OrderVerifiedAddress.Status.values
                    ]
                }
            )
        return data
