from rest_framework import serializers

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
