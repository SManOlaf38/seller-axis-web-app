from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.gs1.models import GS1


class GS1Serializer(serializers.ModelSerializer):
    def validate_gs1(self, value):
        if len(value) < 7:
            raise ValidationError("GS1 must more than or equal 7 characters")
        if not value.isnumeric():
            raise ValidationError("GS1 must be a numeric string")

        return value

    class Meta:
        model = GS1
        exclude = (
            "next_serial_number",
            "organization",
        )
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=GS1.objects.all(),
                fields=["gs1"],
            )
        ]
