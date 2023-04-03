from rest_framework import serializers

from selleraxis.retailers.models import Retailer
from selleraxis.retailers.services.check_sftp import check_sftp


class RetailerSerializer(serializers.ModelSerializer):
    def validate(self, data):
        check_sftp(data)
        return data

    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
