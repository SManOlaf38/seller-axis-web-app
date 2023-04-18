from rest_framework import serializers

from selleraxis.barcode_sizes.serializers import BarcodeSizeSerializer
from selleraxis.package_rules.serializers import PackageRuleSerializer
from selleraxis.product_types.serializers import ProductTypeSerializer
from selleraxis.products.models import Product


class ProductSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["view"].request.headers.get("organization", None) != str(
            data["product_type"].organization.id
        ):
            raise serializers.ValidationError("Product type must is of organization")

        if self.context["view"].request.headers.get("organization", None) != str(
            data["package_rule"].organization.id
        ):
            raise serializers.ValidationError("Package rule must is of organization")

        if self.context["view"].request.headers.get("organization", None) != str(
            data["barcode_size"].organization.id
        ):
            raise serializers.ValidationError("Barcode size must is of organization")

        if Product.objects.filter(
            child_sku=data["child_sku"],
            organization_id=self.context["view"].request.headers.get(
                "organization", None
            ),
        ).exists():
            raise serializers.ValidationError("Product is exist")

        return data

    class Meta:
        model = Product
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadProductSerializer(serializers.ModelSerializer):
    product_type = ProductTypeSerializer(read_only=True)
    package_rule = PackageRuleSerializer(read_only=True)
    barcode_size = BarcodeSizeSerializer(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
