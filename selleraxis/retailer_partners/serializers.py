from rest_framework import serializers

from selleraxis.retailer_partners.models import RetailerPartner


class RetailerPartnerSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["view"].request.headers.get("organization", None) != str(
            data["retailer"].organization.id
        ):
            raise serializers.ValidationError("Retailer must is in organization")

        return data

    class Meta:
        model = RetailerPartner
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
