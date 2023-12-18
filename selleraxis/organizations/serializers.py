from rest_framework import serializers

from selleraxis.organizations.models import Organization
from selleraxis.roles.serializers import RoleSerializer


class OrganizationSerializer(serializers.ModelSerializer):
    user_roles = RoleSerializer(many=True, read_only=True)
    sandbox_organization = serializers.SerializerMethodField()

    def get_user_roles(self, organization):
        user = self.context["view"].request.user
        return RoleSerializer(
            organization.roles.filter(members__user_id=user), many=True
        ).data

    def get_sandbox_organization(self, organization):
        sandbox_organization = organization.sandbox_organization
        if sandbox_organization and sandbox_organization.sandbox_organization is None:
            return OrganizationSerializer(sandbox_organization).data
        return None

    class Meta:
        model = Organization
        extra_kwargs = {
            "id": {"read_only": True},
            "created_by": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "is_sandbox": {"read_only": True},
            "qbo_refresh_token_exp_time": {"read_only": True},
        }
        exclude = [
            "qbo_access_token",
            "qbo_refresh_token",
            "qbo_access_token_exp_time",
            "qbo_user_uuid",
            "realm_id",
        ]


class UpdateOrganizationSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    is_sandbox = serializers.BooleanField(required=False)

    class Meta:
        model = Organization
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_by": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "deleted_at": {"read_only": True},
            "realm_id": {"read_only": True},
            "qbo_access_token": {"read_only": True},
            "qbo_refresh_token": {"read_only": True},
            "qbo_access_token_exp_time": {"read_only": True},
            "qbo_user_uuid": {"read_only": True},
            "qbo_refresh_token_exp_time": {"read_only": True},
            "sandbox_organization": {"read_only": True},
        }
