from rest_framework import serializers

from selleraxis.barcode_sizes.models import BarcodeSize


class BarcodeSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarcodeSize
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
