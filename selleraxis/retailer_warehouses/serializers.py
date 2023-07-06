from rest_framework import exceptions, serializers

from selleraxis.retailer_warehouses.models import RetailerWarehouse


class RetailerWarehouseAliasSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["view"].request.headers.get("organization", None) != str(
            data["retailer"].organization.id
        ):
            raise exceptions.ParseError("Retailer rule must is of organization")
        return data

    class Meta:
        model = RetailerWarehouse
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
