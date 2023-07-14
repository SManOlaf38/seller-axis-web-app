from rest_framework import serializers

from selleraxis.core.serializers import BulkUpdateModelSerializer

from .models import ProductWarehouseStaticData


class ProductWarehouseStaticDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductWarehouseStaticData
        fields = (
            "id",
            "status",
            "qty_on_hand",
            "next_available_qty",
            "next_available_date",
            "retailer_warehouse_product_id",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "retailer_warehouse_product",
        )


class BulkProductWarehouseStaticDataSerializer(
    ProductWarehouseStaticDataSerializer, BulkUpdateModelSerializer
):
    pass
