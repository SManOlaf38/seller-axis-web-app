from rest_framework import serializers

from selleraxis.organizations.models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_by": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
