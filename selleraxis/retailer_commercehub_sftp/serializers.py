from django.core.cache import cache
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from selleraxis.core.clients.sftp_client import ClientError, CommerceHubSFTPClient
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_purchase_orders.serializers import CHECK_ORDER_CACHE_KEY_PREFIX
from selleraxis.retailers.models import Retailer

DEFAULT_INVENTORY_XML_FILE_URL = "./selleraxis/retailers/services/HubXML_Inventory.xsd"


class RetailerCommercehubSFTPSerializer(serializers.ModelSerializer):
    def validate(self, data):
        try:
            sftp_client = CommerceHubSFTPClient(**data)
            sftp_client.connect()
            sftp_client.close()
        except ClientError:
            ValidationError("Could not connect SFTP.")

        if not data.get("inventory_xml_format"):
            data["inventory_xml_format"] = self.safe_load_xml_file(
                DEFAULT_INVENTORY_XML_FILE_URL
            )

        return data

    def to_representation(self, instance: RetailerCommercehubSFTP):
        # clean cache
        cache_key = CHECK_ORDER_CACHE_KEY_PREFIX.format(
            instance.retailer.organization_id
        )
        cache.delete(cache_key)
        return super().to_representation(instance)

    def safe_load_xml_file(self, file_path):
        try:
            with open(file_path, mode="r", encoding="utf-8") as f:
                return f.read()
        except FileNotFoundError:
            pass

    class Meta:
        model = RetailerCommercehubSFTP
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class RetailerSerializerShow(serializers.ModelSerializer):
    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadRetailerCommercehubSFTPSerializer(serializers.ModelSerializer):
    retailer = RetailerSerializerShow(read_only=True)

    class Meta:
        model = RetailerCommercehubSFTP
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
