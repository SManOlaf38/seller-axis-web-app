from rest_framework import serializers

from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_commercehub_sftp.services import check_sftp


class RetailerCommercehubSFTPSerializer(serializers.ModelSerializer):
    def validate(self, data):
        check_sftp(data)
        return data

    class Meta:
        model = RetailerCommercehubSFTP
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
