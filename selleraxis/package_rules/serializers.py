from rest_framework import exceptions, serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.boxes.serializers import BoxSerializer
from selleraxis.package_rules.models import PackageRule
from selleraxis.product_series.serializers import ProductSeriesSerializer


class PackageRuleSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if "box" in data and str(data["product_series"].organization.id) != str(
            data["box"].organization.id
        ):
            raise exceptions.ParseError("Product must is of retailer!")
        return data

    class Meta:
        model = PackageRule
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=PackageRule.objects.all(),
                fields=["box", "product_series"],
            )
        ]


class ReadPackageRuleSerializer(serializers.ModelSerializer):
    product_series = ProductSeriesSerializer(read_only=True)
    box = BoxSerializer(read_only=True)

    class Meta:
        model = PackageRule
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
