from rest_framework import serializers
from rest_framework.exceptions import ParseError

from selleraxis.role_user.models import RoleUser
from selleraxis.roles.models import Role
from selleraxis.roles.serializers import RoleSerializer
from selleraxis.users.serializers import UserSerializer


class CreateRoleUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, max_length=50, min_length=6)
    role = serializers.IntegerField(required=True)

    def validate(self, data):
        if RoleUser.objects.filter(
            role=data["role"], user__email=data["email"]
        ).exists():
            raise ParseError("User had this role!")
        return data


class ReadRoleUserSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source="user.email", read_only=True)
    role = RoleSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = RoleUser
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class UpdateRoleUserSerializer(serializers.Serializer):
    role = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), required=True
    )

    def update(self, instance, validated_data):
        role = validated_data.get("role")
        instance.role_id = role.id
        instance.save()
        return instance
