from rest_framework import serializers

from selleraxis.boxes.serializers import BoxSerializer
from selleraxis.package_rules.models import PackageRule
from selleraxis.products.models import Product

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
    box = BoxSerializer(read_only=True)

    class Meta:
        model = PackageRule
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadProductSerializerShow(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadProductSeriesSerializer(serializers.ModelSerializer):
    package_rules = ReadPackageRuleSerializerShow(read_only=True, many=True)
    products = ReadProductSerializerShow(read_only=True, many=True)

    class Meta:
        model = ProductSeries
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
