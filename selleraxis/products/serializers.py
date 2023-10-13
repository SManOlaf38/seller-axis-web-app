from rest_framework import exceptions, serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.product_series.serializers import ProductSeriesSerializer
from selleraxis.products.models import Product


class ProductSerializer(serializers.ModelSerializer):
    def validate(self, data):
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
        validators = [
            UniqueTogetherValidator(queryset=Product.objects.all(), fields=["sku"]),
            UniqueTogetherValidator(queryset=Product.objects.all(), fields=["upc"]),
        ]


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


class CreateQuickbookProductSerializer(serializers.Serializer):
    action = serializers.CharField(max_length=255, required=True)
    model = serializers.CharField(max_length=255, required=True)
    object_id = serializers.IntegerField(required=True)
