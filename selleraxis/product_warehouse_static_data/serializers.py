from rest_framework import serializers

from selleraxis.core.serializers import BulkUpdateModelSerializer
from .models import ProductWarehouseStaticData


class ProductWarehouseStaticDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductWarehouseStaticData
        fields = "__all__"


class BulkProductWarehouseStaticDataSerializer(BulkUpdateModelSerializer):
    class Meta:
        model = ProductWarehouseStaticData
        fields = "__all__"
