from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from selleraxis.retailer_warehouses.models import RetailerWarehouse
from selleraxis.retailers.models import Retailer


class RetailerWarehouseAliasSerializer(serializers.ModelSerializer):
    def validate(self, data):
        try:
            retailer = RetailerWarehouse.objects.get(
                name=data["name"],
                organization=self.context["view"].request.headers.get(
                    "organization", None
                ),
            )
        except Exception:
            retailer = None
        if retailer:
            raise ValidationError("Retailer Warehouse is already exist on organization")
        if "retailer" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["retailer"].organization.id):
            raise ValidationError(
                detail={"retailer": ["Retailer rule must is of organization"]}
            )

        if "address_1" in data and not data["address_1"]:
            raise ValidationError(detail={"address_1": ["Address field is required"]})
        if "city" in data and not data["city"]:
            raise ValidationError({"city": ["City field is required"]})
        if "state" in data and not data["state"]:
            raise ValidationError({"state": ["State field is required"]})
        if "postal_code" in data and not data["postal_code"]:
            raise ValidationError({"postal_code": ["Postal code field is required"]})
        if "country" in data:
            if not data["country"]:
                raise ValidationError({"country": ["Country field is required"]})
            if len(data["country"]) != 2:
                raise ValidationError(
                    {"country": ["Country length field is required 2 letters"]}
                )
        if "phone" in data and not data["phone"]:
            raise ValidationError({"phone": ["Phone field is required"]})
        return data

    class Meta:
        model = RetailerWarehouse
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
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
    class Meta:
        model = RetailerWarehouse
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
