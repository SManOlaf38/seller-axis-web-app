from rest_framework import serializers

from selleraxis.invoice.models import Invoice


class CodeSerializer(serializers.Serializer):
    auth_code = serializers.CharField()
    realm_id = serializers.CharField()


class InvoiceSerializerShow(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
