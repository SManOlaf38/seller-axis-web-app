from rest_framework import serializers

from selleraxis.organizations.serializers import OrganizationSerializer
from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailer_shippers.models import RetailerShipper
from selleraxis.services.models import Services
from selleraxis.shipping_ref.models import ShippingRef
from selleraxis.shipping_service_types.serializers import (
    ShippingServiceTypeSerializerShow,
)


class RetailerShipperSerializerShow(serializers.ModelSerializer):
    class Meta:
        model = RetailerShipper
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class RetailerCarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerCarrier
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ShippingRefSerializerShowInService(serializers.ModelSerializer):
    class Meta:
        model = ShippingRef
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ServicesSerializerShowInCarrier(serializers.ModelSerializer):
    shipping_ref_service = ShippingRefSerializerShowInService(many=True)

    class Meta:
        model = Services
        exclude = ("general_client_id", "general_client_secret")
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class ReadRetailerCarrierSerializer(serializers.ModelSerializer):
    service = ServicesSerializerShowInCarrier(read_only=True)
    organization = OrganizationSerializer(read_only=True)
    shipper = RetailerShipperSerializerShow(read_only=True)
    default_service_type = ShippingServiceTypeSerializerShow(read_only=True)

    class Meta:
        model = RetailerCarrier
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
