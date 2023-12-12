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
        if sandbox_organization:
            return OrganizationSerializer(sandbox_organization).data
        return None

    class Meta:
        model = Organization
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_by": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "qbo_access_token": {"write_only": True},
            "qbo_refresh_token": {"write_only": True},
            "qbo_access_token_exp_time": {"write_only": True},
            "qbo_user_uuid": {"write_only": True},
            "is_sandbox": {"read_only": True},
        }


class UpdateOrganizationSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)

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
