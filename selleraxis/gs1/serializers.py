from rest_framework import exceptions, serializers
from rest_framework.exceptions import ValidationError

from selleraxis.gs1.models import GS1


class GS1Serializer(serializers.ModelSerializer):
    def validate_gs1(self, value):
        if len(value) < 7:
            raise ValidationError("GS1 must more than or equal 7 characters")
        if not value.isnumeric():
            raise ValidationError("GS1 must be a numeric string")

        organization_id = self.context["view"].request.headers.get("organization", None)
        if organization_id is None:
            raise exceptions.ParseError("Miss organization id")
        gs1 = GS1.objects.filter(gs1=value, organization_id=organization_id).first()
        if gs1:
            raise exceptions.ParseError("The field gs1 must make a unique set")

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
