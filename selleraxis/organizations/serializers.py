import asyncio

from asgiref.sync import async_to_sync
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


from selleraxis.retailers.serializers import RetailerCheckOrderSerializer  # noqa


class OrganizationRetailerCheckOrder(serializers.ModelSerializer):
    retailers = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ["id", "retailers"]

    @async_to_sync
    async def get_retailers(self, instance):

        retailers = instance.retailer_organization.all()
        retailers = await asyncio.gather(
            *[self.from_retailer_to_dict(RetailerCheckOrderSerializer(retailer)) for retailer in retailers]
        )
        return retailers

    @staticmethod
    async def from_retailer_to_dict(retailer_serializer) -> dict:
        return retailer_serializer.data
