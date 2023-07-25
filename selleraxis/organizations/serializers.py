from rest_framework import serializers

from selleraxis.organizations.models import Organization
from selleraxis.roles.serializers import RoleSerializer


class OrganizationSerializer(serializers.ModelSerializer):
    user_roles = serializers.SerializerMethodField()

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
        }
