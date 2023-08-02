from django.core.cache import cache
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from selleraxis.core.clients.sftp_client import ClientError, CommerceHubSFTPClient
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_purchase_orders.serializers import CHECK_ORDER_CACHE_KEY_PREFIX


class RetailerCommercehubSFTPSerializer(serializers.ModelSerializer):
    def validate(self, data):
        try:
            sftp_client = CommerceHubSFTPClient(**data)
            sftp_client.connect()
            sftp_client.close()
        except ClientError:
            ValidationError("Could not connect SFTP.")

        return data

    def to_representation(self, instance: RetailerCommercehubSFTP):
        # clean cache
        cache_key = CHECK_ORDER_CACHE_KEY_PREFIX.format(
            instance.retailer.organization_id
        )
        cache.delete(cache_key)
        return super().to_representation(instance)

    class Meta:
        model = RetailerCommercehubSFTP
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
