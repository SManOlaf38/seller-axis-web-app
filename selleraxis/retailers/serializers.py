from django.core.exceptions import ObjectDoesNotExist
from django.utils.dateparse import parse_datetime
from rest_framework import serializers
from rest_framework.exceptions import ParseError

from selleraxis.core.clients.sftp_client import ClientError, CommerceHubSFTPClient
from selleraxis.retailer_queue_histories.serializers import (
    RetailerQueueHistorySerializer,
)
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


class RetailerCheckOrderSerializer(serializers.ModelSerializer):
    count = serializers.IntegerField(default=0)

    class Meta(RetailerSerializer.Meta):
        pass

    def to_representation(self, instance):
        data = super().to_representation(instance)
        try:
            sftp_dict = instance.retailer_commercehub_sftp.__dict__
            sftp_client = CommerceHubSFTPClient(**sftp_dict)
            sftp_client.connect()

        except ClientError:
            raise ParseError("Could not connect SFTP client")

        except ObjectDoesNotExist:
            data["count"] = 0
            return data

        try:
            files = sftp_client.listdir_purchase_orders()
            count_files = len(files)
            order_batches = instance.retailer_order_batch.all()
            order_batch_file_names = {
                str(order_batch.file_name).lower() for order_batch in order_batches
            }
            for file in files:
                if str(file).lower() in order_batch_file_names:
                    count_files -= 1
            data["count"] = count_files if count_files > 0 else 0
        except Exception:
            raise ParseError("Could not fetch retailer check order")

        sftp_client.close()
        return data


from selleraxis.product_alias.serializers import ReadProductAliasDataSerializer  # noqa


class ReadRetailerSerializer(serializers.ModelSerializer):
    retailer_products_aliases = serializers.SerializerMethodField()
    retailer_warehouses = RetailerWarehouseAliasSerializer(many=True, read_only=True)
    retailer_queue_history = RetailerQueueHistorySerializer(read_only=True, many=True)

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


class ReadRetailerSerializerShow(serializers.ModelSerializer):
    retailer_queue_history = RetailerQueueHistorySerializer(read_only=True, many=True)

    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
