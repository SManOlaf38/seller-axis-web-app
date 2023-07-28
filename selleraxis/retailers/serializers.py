from django.utils.dateparse import parse_datetime
from rest_framework import serializers

from selleraxis.product_alias.serializers import ReadProductAliasDataSerializer
from selleraxis.retailer_commercehub_sftp.serializers import RetailerCommercehubSFTP
from selleraxis.retailer_warehouses.serializers import RetailerWarehouseAliasSerializer
from selleraxis.retailers.models import Retailer


class RetailerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class RetailerCommercehubSFTPSerializerShow(serializers.ModelSerializer):
    class Meta:
        model = RetailerCommercehubSFTP
        fields = "__all__"


class ReadRetailerSerializer(serializers.ModelSerializer):
    retailer_products_aliases = serializers.SerializerMethodField()
    retailer_warehouses = RetailerWarehouseAliasSerializer(many=True, read_only=True)
    retailer_commercehub_sftp = RetailerCommercehubSFTPSerializerShow(read_only=True)

    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def get_retailer_products_aliases(self, obj):
        product_alias_serializer = ReadProductAliasDataSerializer(
            obj.retailer_products_aliases, many=True
        )
        return product_alias_serializer.data


class XMLRetailerSerializer(serializers.ModelSerializer):
    retailer_products_aliases = serializers.SerializerMethodField()
    retailer_warehouses = RetailerWarehouseAliasSerializer(many=True, read_only=True)

    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def get_retailer_products_aliases(self, obj):
        product_alias_serializer = ReadProductAliasDataSerializer(
            obj.retailer_products_aliases, many=True
        )
        return product_alias_serializer.data

    def to_representation(self, instance):
        # retailer_products_aliases.[retailer_products_alias_id].retailer_warehouse_products.[retailer_warehouse_product_id].product_warehouse_statices.next_available_date
        representation = super().to_representation(instance)

        for retailer_products_alias in representation["retailer_products_aliases"]:
            for retailer_warehouse_product in retailer_products_alias[
                "retailer_warehouse_products"
            ]:
                retailer_warehouse_product["product_warehouse_statices"][
                    "next_available_date"
                ] = parse_datetime(
                    retailer_warehouse_product["product_warehouse_statices"][
                        "next_available_date"
                    ]
                ).strftime(
                    "%Y%m%d"
                )

        return representation
