from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.role_user.models import RoleUser


class RoleUserSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["view"].request.headers.get("organization", None) != str(
            data["role"].organization.id
        ):
            raise serializers.ValidationError("Role must is in organization")

        return data

    class Meta:
        model = RoleUser
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=RoleUser.objects.all(), fields=["user", "role"]
            )
        ]
