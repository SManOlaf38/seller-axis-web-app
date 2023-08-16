from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from selleraxis.core.clients.sftp_client import ClientError, CommerceHubSFTPClient
from selleraxis.retailer_carriers.serializers import RetailerCarrierSerializer
from selleraxis.retailer_queue_histories.serializers import (
    RetailerQueueHistorySerializer,
)
from selleraxis.retailer_warehouses.models import RetailerWarehouse
from selleraxis.retailer_warehouses.serializers import (
    ReadRetailerWarehouseSerializer,
    RetailerWarehouseAliasSerializer,
)
from selleraxis.retailers.models import Retailer

from .exceptions import RetailerCheckOrderFetchException, SFTPClientErrorException


class RetailerSerializer(serializers.ModelSerializer):
    vendor_id = serializers.CharField(max_length=255, required=True)
    default_warehouse = ReadRetailerWarehouseSerializer(read_only=True)
    default_carrier = RetailerCarrierSerializer(read_only=True)

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
            raise SFTPClientErrorException

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
            raise RetailerCheckOrderFetchException

        sftp_client.close()
        return data


from selleraxis.product_alias.serializers import ReadProductAliasDataSerializer  # noqa


class ReadRetailerSerializer(serializers.ModelSerializer):
    retailer_products_aliases = serializers.SerializerMethodField()
    retailer_warehouses = serializers.SerializerMethodField()
    retailer_queue_history = RetailerQueueHistorySerializer(read_only=True, many=True)
    default_warehouse = ReadRetailerWarehouseSerializer(read_only=True)
    default_carrier = RetailerCarrierSerializer(read_only=True)

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

    def get_retailer_warehouses(self, obj):
        retailer_warehouses = RetailerWarehouse.objects.filter(
            organization_id=obj.organization_id
        )
        serializer = RetailerWarehouseAliasSerializer(retailer_warehouses, many=True)
        return serializer.data


class XMLRetailerSerializer(ReadRetailerSerializer):
    pass


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
