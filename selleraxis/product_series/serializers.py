from rest_framework import serializers

from selleraxis.boxes.serializers import BoxSerializer
from selleraxis.package_rules.models import PackageRule

from .models import ProductSeries


class ProductSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSeries
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadPackageRuleSerializerShow(serializers.ModelSerializer):
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


class ReadProductSeriesSerializer(serializers.ModelSerializer):
    package_rules = ReadPackageRuleSerializerShow(read_only=True, many=True)

    class Meta:
        model = ProductSeries
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
