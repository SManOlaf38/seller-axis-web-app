from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from selleraxis.addresses.models import Address
from selleraxis.core.clients.sftp_client import ClientError, CommerceHubSFTPClient
from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailer_carriers.serializers import RetailerShipperSerializerShow
from selleraxis.retailer_queue_histories.serializers import (
    RetailerQueueHistorySerializer,
)
from selleraxis.retailer_warehouses.models import RetailerWarehouse
from selleraxis.retailer_warehouses.serializers import (
    ReadRetailerWarehouseSerializer,
    RetailerWarehouseAliasSerializer,
)
from selleraxis.retailers.models import Retailer
from selleraxis.services.serializers import ServicesSerializer

from ..addresses.serializers import AddressSerializer
from ..gs1.serializers import GS1Serializer
from ..retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from ..shipping_service_types.serializers import ShippingServiceTypeSerializerShow
from .exceptions import RetailerCheckOrderFetchException, SFTPClientErrorException

DEFAULT_INVENTORY_XSD_FILE_URL = "./selleraxis/retailers/services/HubXML_Inventory.xsd"
DEFAULT_CONFIRMATION_XSD_FILE_URL = (
    "./selleraxis/retailer_purchase_orders/services/HubXML_Confirmation.xsd"
)


class RetailerSerializer(serializers.ModelSerializer):
    vendor_id = serializers.CharField(max_length=255, required=True)

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
            if not sftp_client.purchase_orders_sftp_directory:
                sftp_client.purchase_orders_sftp_directory = (
                    f"/outgoing/orders/{instance.merchant_id}/"
                )
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


class RetailerCarrierSerializerShowRetailer(serializers.ModelSerializer):
    service = ServicesSerializer(read_only=True)
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


class ReadRetailerSerializer(serializers.ModelSerializer):
    retailer_products_aliases = serializers.SerializerMethodField()
    retailer_warehouses = serializers.SerializerMethodField()
    default_warehouse = ReadRetailerWarehouseSerializer(read_only=True)
    default_carrier = RetailerCarrierSerializerShowRetailer(read_only=True)
    default_gs1 = GS1Serializer(read_only=True)
    result_url = serializers.CharField(max_length=255)
    ship_from_address = AddressSerializer(read_only=True)

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
    def get_retailer_products_aliases(self, obj):
        product_alias_serializer = ReadProductAliasDataSerializer(
            obj.retailer_products_aliases, many=True
        )
        return product_alias_serializer.data


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


class CreateAddressSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if "country" in data and len(data["country"]) != 2:
            raise ValidationError(
                {"country": ["Country length field is required 2 letters"]}
            )
        if (
            "status" in data
            and str(data["status"]).upper() not in Address.Status.values
        ):
            raise ValidationError(
                {
                    "status": [
                        "Status must be one of the following fields: %s"
                        % Address.Status.values
                    ]
                }
            )
        return data

    class Meta:
        model = Address
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "verified_carrier": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class CreateSFTPSerializer(serializers.ModelSerializer):
    def validate(self, data):
        try:
            sftp_client = CommerceHubSFTPClient(**data)
            sftp_client.connect()
            sftp_client.close()
        except ClientError:
            ValidationError("Could not connect SFTP.")

        if not data.get("inventory_xml_format"):
            data["inventory_xml_format"] = self.safe_load_xml_file(
                DEFAULT_INVENTORY_XSD_FILE_URL
            )

        if not data.get("confirm_xml_format"):
            data["confirm_xml_format"] = self.safe_load_xml_file(
                DEFAULT_CONFIRMATION_XSD_FILE_URL
            )
        return data

    def safe_load_xml_file(self, file_path):
        try:
            with open(file_path, mode="r", encoding="utf-8") as f:
                return f.read()
        except FileNotFoundError:
            pass

    class Meta:
        model = RetailerCommercehubSFTP
        fields = ["sftp_host", "sftp_username", "sftp_password"]


class CreateRetailerSerializer(serializers.ModelSerializer):
    retailer_sftp = CreateSFTPSerializer(write_only=True)
    ship_from_address = CreateAddressSerializer(write_only=True)

    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class UpdateRetailerSerializer(serializers.ModelSerializer):
    retailer_sftp = CreateSFTPSerializer(write_only=True)
    ship_from_address = CreateAddressSerializer(write_only=True)

    class Meta:
        model = Retailer
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
