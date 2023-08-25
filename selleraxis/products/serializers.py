from rest_framework import exceptions, serializers

from selleraxis.product_series.serializers import ProductSeriesSerializer
from selleraxis.products.models import Product


class ProductSerializer(serializers.ModelSerializer):
    def validate(self, data):
        sku = data.get("sku")
        id = self.context.get("request").parser_context.get("kwargs").get("id")
        organization = self.context["view"].request.headers.get("organization", None)
        if sku and organization and id:
            queryset = Product.objects.filter(
                sku=sku, product_series__organization=organization
            ).exclude(id=id)
            if queryset.exists():
                raise exceptions.ParseError("SKU already exists for this organization.")
        else:
            queryset = Product.objects.filter(
                sku=sku, product_series__organization=organization
            )
            if queryset.exists():
                raise exceptions.ParseError("SKU already exists for this organization.")

        if "upc" in data and not str(data["upc"]).isnumeric():
            raise exceptions.ParseError("UPC codes must be numeric.")

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
    product_series = ProductSeriesSerializer(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }