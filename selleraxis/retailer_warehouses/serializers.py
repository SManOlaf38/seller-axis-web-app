from rest_framework import exceptions, serializers

from selleraxis.retailer_warehouses.models import RetailerWarehouse
from selleraxis.retailers.models import Retailer


class RetailerWarehouseAliasSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if "retailer" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["retailer"].organization.id):
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


class RetailerShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadRetailerWarehouseSerializer(serializers.ModelSerializer):
    retailer = RetailerShowSerializer(read_only=True)

    class Meta:
        model = RetailerWarehouse
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
