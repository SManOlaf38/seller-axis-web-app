from rest_framework import serializers


class CodeSerializer(serializers.Serializer):
    auth_code = serializers.CharField()
    realm_id = serializers.CharField()


class InvoiceSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    realm_id = serializers.CharField()
