from rest_framework import serializers

from selleraxis.organizations.models import Organization
from selleraxis.roles.serializers import RoleSerializer


class OrganizationSerializer(serializers.ModelSerializer):
    user_roles = RoleSerializer(many=True, read_only=True)

    def get_user_roles(self, organization):
        user = self.context["view"].request.user
        return RoleSerializer(
            organization.roles.filter(members__user_id=user), many=True
        ).data

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
            "live_qbo_access_token": {"write_only": True},
            "live_qbo_refresh_token": {"write_only": True},
            "live_qbo_access_token_exp_time": {"write_only": True},
            "is_sandbox": {"read_only": True},
        }
