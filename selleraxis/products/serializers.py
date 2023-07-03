from rest_framework import exceptions, serializers

from selleraxis.products.models import Product


class ProductSerializer(serializers.ModelSerializer):
    def validate(self, data):
        sku = data.get("sku")
        organization = self.context["view"].request.headers.get("organization", None)
        if sku and organization:
            queryset = Product.objects.filter(sku=sku, organization=organization)
            if queryset.exists():
                raise exceptions.ParseError("SKU already exists for this organization.")

        if self.context["view"].request.headers.get("organization", None) != str(
            data["package_rule"].organization.id
        ):
            raise exceptions.ParseError("Package rule must is of organization")
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
