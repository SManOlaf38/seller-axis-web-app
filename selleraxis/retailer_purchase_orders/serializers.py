import asyncio
from datetime import datetime, timezone

from asgiref.sync import async_to_sync, sync_to_async
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import ParseError
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.addresses.models import Address
from selleraxis.addresses.serializers import AddressSerializer
from selleraxis.boxes.serializers import BoxSerializer
from selleraxis.core.clients.sftp_client import (
    ClientError,
    CommerceHubSFTPClient,
    FolderNotFoundError,
)
from selleraxis.gs1.serializers import GS1Serializer
from selleraxis.invoice.serializers import InvoiceSerializerShow
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.models import OrderPackage
from selleraxis.organizations.models import Organization
from selleraxis.retailer_carriers.serializers import ReadRetailerCarrierSerializer
from selleraxis.retailer_order_batchs.models import RetailerOrderBatch
from selleraxis.retailer_order_batchs.serializers import (
    ReadRetailerOrderBatchSerializer,
)
from selleraxis.retailer_participating_parties.serializers import (
    RetailerParticipatingPartySerializer,
)
from selleraxis.retailer_person_places.serializers import RetailerPersonPlaceSerializer
from selleraxis.retailer_purchase_order_items.serializers import (
    CustomRetailerPurchaseOrderItemSerializer,
    RetailerPurchaseOrderItemSerializer,
)
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.retailer_purchase_orders.services.services import (
    get_shipping_ref,
    get_shipping_ref_code,
)
from selleraxis.retailer_warehouses.models import RetailerWarehouse
from selleraxis.retailer_warehouses.serializers import ReadRetailerWarehouseSerializer
from selleraxis.retailers.serializers import RetailerCheckOrderSerializer
from selleraxis.retailers.services.import_data import read_purchase_order_xml_data
from selleraxis.shipments.serializers import ShipmentSerializerShow
from selleraxis.shipping_service_types.models import ShippingServiceType
from selleraxis.shipping_service_types.serializers import (
    ShippingServiceTypeSerializerShow,
)

DEFAULT_SHIP_DATE_FORMAT_DATETIME = "%Y%m%d"
CHECK_ORDER_CACHE_KEY_PREFIX = "order_check_{}"


class RetailerPurchaseOrderSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if "batch" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["batch"].retailer.organization.id):
            raise serializers.ValidationError("Batch must is in organization")

        if "participating_party" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["participating_party"].retailer.organization.id):
            raise serializers.ValidationError(
                "Participating party must is in organization"
            )

        if "ship_to" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["ship_to"].retailer.organization.id):
            raise serializers.ValidationError("Ship to address must is in organization")

        if "bill_to" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["bill_to"].retailer.organization.id):
            raise serializers.ValidationError("Bill to address must is in organization")

        if "invoice_to" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["invoice_to"].retailer.organization.id):
            raise serializers.ValidationError(
                "Invoice to address must is in organization"
            )

        if "customer" in data and self.context["view"].request.headers.get(
            "organization", None
        ) != str(data["customer"].retailer.organization.id):
            raise serializers.ValidationError(
                "Customer address must is in organization"
            )

        return data

    class Meta:
        model = RetailerPurchaseOrder
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
        validators = [
            UniqueTogetherValidator(
                queryset=RetailerPurchaseOrder.objects.all(),
                fields=["batch", "retailer_purchase_order_id"],
            )
        ]


class OrderGetPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderPackage
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class GetOrderItemPackageSerializer(serializers.ModelSerializer):
    retailer_purchase_order_item = serializers.SerializerMethodField()

    def get_retailer_purchase_order_item(self, instance: OrderItemPackage) -> dict:
        serializer = RetailerPurchaseOrderItemSerializer(instance.order_item)
        return serializer.data

    class Meta:
        model = OrderItemPackage
        fields = "__all__"


class CustomOrderItemPackageSerializer(GetOrderItemPackageSerializer):
    retailer_purchase_order_item = serializers.SerializerMethodField()

    def get_retailer_purchase_order_item(self, instance: OrderItemPackage) -> dict:
        serializer = CustomRetailerPurchaseOrderItemSerializer(instance.order_item)
        return serializer.data

    class Meta:
        model = OrderItemPackage
        fields = "__all__"


class OrderPackageSerializerShow(serializers.ModelSerializer):
    box = BoxSerializer(read_only=True)

    class Meta:
        model = OrderPackage
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class CustomOrderPackageSerializer(OrderPackageSerializerShow):
    order_item_packages = GetOrderItemPackageSerializer(many=True, read_only=True)
    shipment_packages = ShipmentSerializerShow(many=True, read_only=True)


class ReadRetailerPurchaseOrderSerializer(serializers.ModelSerializer):
    batch = ReadRetailerOrderBatchSerializer(read_only=True)
    participating_party = RetailerParticipatingPartySerializer(read_only=True)
    ship_to = RetailerPersonPlaceSerializer(read_only=True)
    ship_from = AddressSerializer(read_only=True)
    bill_to = RetailerPersonPlaceSerializer(read_only=True)
    invoice_to = RetailerPersonPlaceSerializer(read_only=True)
    customer = RetailerPersonPlaceSerializer(read_only=True)
    items = RetailerPurchaseOrderItemSerializer(many=True, read_only=True)
    verified_ship_to = AddressSerializer(read_only=True)
    order_packages = CustomOrderPackageSerializer(many=True, read_only=True)
    carrier = ReadRetailerCarrierSerializer(read_only=True)
    invoice_order = InvoiceSerializerShow(read_only=True)
    shipping_service = serializers.SerializerMethodField()
    gs1 = GS1Serializer(read_only=True)
    warehouse = ReadRetailerWarehouseSerializer(read_only=True)
    shipping_ref_1 = serializers.SerializerMethodField()
    shipping_ref_2 = serializers.SerializerMethodField()
    shipping_ref_3 = serializers.SerializerMethodField()
    shipping_ref_4 = serializers.SerializerMethodField()
    shipping_ref_5 = serializers.SerializerMethodField()
    shipping_ref_1_code = serializers.SerializerMethodField()
    shipping_ref_2_code = serializers.SerializerMethodField()
    shipping_ref_3_code = serializers.SerializerMethodField()
    shipping_ref_4_code = serializers.SerializerMethodField()
    shipping_ref_5_code = serializers.SerializerMethodField()

    def get_shipping_ref_1_code(self, obj):
        carrier = obj.carrier
        shipping_ref_type = obj.batch.retailer.shipping_ref_1_type
        return get_shipping_ref_code(carrier, shipping_ref_type)

    def get_shipping_ref_2_code(self, obj):
        carrier = obj.carrier
        shipping_ref_type = obj.batch.retailer.shipping_ref_2_type
        return get_shipping_ref_code(carrier, shipping_ref_type)

    def get_shipping_ref_3_code(self, obj):
        carrier = obj.carrier
        shipping_ref_type = obj.batch.retailer.shipping_ref_3_type
        return get_shipping_ref_code(carrier, shipping_ref_type)

    def get_shipping_ref_4_code(self, obj):
        carrier = obj.carrier
        shipping_ref_type = obj.batch.retailer.shipping_ref_4_type
        return get_shipping_ref_code(carrier, shipping_ref_type)

    def get_shipping_ref_5_code(self, obj):
        carrier = obj.carrier
        shipping_ref_type = obj.batch.retailer.shipping_ref_5_type
        return get_shipping_ref_code(carrier, shipping_ref_type)

    def get_shipping_ref_1(self, obj):
        response = obj.shipping_ref_1
        shipping_ref_type = obj.batch.retailer.shipping_ref_1_type
        value = obj.batch.retailer.shipping_ref_1_value
        return get_shipping_ref(obj, response, shipping_ref_type, value)

    def get_shipping_ref_2(self, obj):
        response = obj.shipping_ref_2
        shipping_ref_type = obj.batch.retailer.shipping_ref_2_type
        value = obj.batch.retailer.shipping_ref_2_value
        return get_shipping_ref(obj, response, shipping_ref_type, value)

    def get_shipping_ref_3(self, obj):
        response = obj.shipping_ref_3
        shipping_ref_type = obj.batch.retailer.shipping_ref_3_type
        value = obj.batch.retailer.shipping_ref_3_value
        return get_shipping_ref(obj, response, shipping_ref_type, value)

    def get_shipping_ref_4(self, obj):
        response = obj.shipping_ref_4
        shipping_ref_type = obj.batch.retailer.shipping_ref_4_type
        value = obj.batch.retailer.shipping_ref_4_value
        return get_shipping_ref(obj, response, shipping_ref_type, value)

    def get_shipping_ref_5(self, obj):
        response = obj.shipping_ref_5
        shipping_ref_type = obj.batch.retailer.shipping_ref_5_type
        value = obj.batch.retailer.shipping_ref_5_value
        return get_shipping_ref(obj, response, shipping_ref_type, value)

    def get_shipping_service(self, obj):
        shipping_service = ShippingServiceType.objects.filter(
            code=obj.shipping_service
        ).first()
        shipping_service_serializer = ShippingServiceTypeSerializerShow(
            shipping_service
        )
        return shipping_service_serializer.data

    class Meta:
        model = RetailerPurchaseOrder
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }

    def to_representation(self, instance: RetailerPurchaseOrder):
        if instance.warehouse is None:
            instance.warehouse = RetailerWarehouse.objects.filter(
                name=instance.vendor_warehouse_id
            ).first()
        if instance.ship_from is None and instance.batch.retailer.ship_from_address:
            self.create_ship_from(instance)

        if instance.verified_ship_to is None and instance.ship_to:
            self.create_verified_ship_to(instance)

        return super().to_representation(instance)

    def create_ship_from(self, order: RetailerPurchaseOrder):
        retailer_address = order.batch.retailer.ship_from_address
        write_fields = {
            key: value
            for key, value in retailer_address.__dict__.items()
            if hasattr(Address, key)
        }
        write_fields.pop("id")
        write_fields["status"] = Address.Status.ORIGIN
        instance = Address(**write_fields)
        instance.save()
        order.ship_from = instance
        order.save()

    def create_verified_ship_to(self, order: RetailerPurchaseOrder):
        is_attention = self.is_attention_from_address_1(
            address_1=order.ship_to.address_1
        )
        status = Address.Status.ORIGIN.value
        if is_attention and order.ship_to.address_2:
            order.ship_to.company = order.ship_to.address_1
            order.ship_to.address_1 = order.ship_to.address_2
            order.ship_to.address_2 = None
            order.ship_to.save()
            status = Address.Status.EDITED.value

        verified_ship_to = Address(
            company=order.ship_to.company,
            contact_name=order.ship_to.name,
            address_1=order.ship_to.address_1,
            address_2=order.ship_to.address_2,
            city=order.ship_to.city,
            state=order.ship_to.state,
            country=order.ship_to.country,
            postal_code=order.ship_to.postal_code,
            phone=order.ship_to.day_phone,
            status=status,
            organization=order.batch.retailer.organization,
        )
        verified_ship_to.save()
        order.verified_ship_to = verified_ship_to
        order.save()

    def is_attention_from_address_1(self, address_1: str) -> bool:
        if "ship to store" in address_1.lower():
            return True
        if "c/o thd" in address_1.lower():
            return True
        if "co thd" in address_1.lower():
            return True


class PurchaseOrderXMLMixinSerializer(ReadRetailerPurchaseOrderSerializer):
    partner_id = serializers.SerializerMethodField()
    merchant_id = serializers.SerializerMethodField()
    ack_type = serializers.SerializerMethodField()
    message_count = serializers.SerializerMethodField()
    order_date = serializers.SerializerMethodField()
    expected_ship_date = serializers.SerializerMethodField()
    participation_code = serializers.SerializerMethodField()
    vendor_warehouse_id = serializers.SerializerMethodField()
    action = serializers.SerializerMethodField()
    partner_name = serializers.SerializerMethodField()
    partner_role = serializers.SerializerMethodField()
    trx_shipping = serializers.SerializerMethodField()
    trx_handling = serializers.SerializerMethodField()
    trx_tax = serializers.SerializerMethodField()
    trx_credits = serializers.SerializerMethodField()
    trx_currency = serializers.SerializerMethodField()
    trx_misc_charges = serializers.SerializerMethodField()
    trx_discount = serializers.SerializerMethodField()
    tax_breakout = serializers.SerializerMethodField()
    carb_code = serializers.SerializerMethodField()
    credit_breakout = serializers.SerializerMethodField()
    discount_breakout = serializers.SerializerMethodField()
    misc_charge_breakout = serializers.SerializerMethodField()
    partner_inc = serializers.SerializerMethodField()
    disc_type_code = serializers.SerializerMethodField()
    disc_date_code = serializers.SerializerMethodField()
    disc_percent = serializers.SerializerMethodField()
    disc_days_due = serializers.SerializerMethodField()
    net_days_due = serializers.SerializerMethodField()
    retailer_merchant_id = serializers.SerializerMethodField()
    tax_type = serializers.SerializerMethodField()
    alw_chg_indicator = serializers.SerializerMethodField()
    charge_type = serializers.SerializerMethodField()

    def get_partner_id(self, instance) -> str:
        return "infibrite"

    def get_partner_inc(self, instance) -> str:
        return "Infibrite Inc"

    def get_merchant_id(self, instance) -> str:
        return instance.batch.retailer.merchant_id

    def get_ack_type(self, instance) -> str:
        return "status-update"

    def get_message_count(self, instance: RetailerPurchaseOrder) -> int:
        return len(instance.items.all())

    def get_order_date(self, instance: RetailerPurchaseOrder) -> str:
        return instance.order_date.strftime(DEFAULT_SHIP_DATE_FORMAT_DATETIME)

    def get_expected_ship_date(self, instance: RetailerPurchaseOrder) -> str:
        if instance.ship_date is None:
            return datetime.now().strftime(DEFAULT_SHIP_DATE_FORMAT_DATETIME)
        return instance.ship_date.strftime(DEFAULT_SHIP_DATE_FORMAT_DATETIME)

    def get_participation_code(self, instance: RetailerPurchaseOrder) -> str:
        return "To:"

    def get_vendor_warehouse_id(self, instance: RetailerPurchaseOrder) -> str:
        if instance.warehouse:
            return instance.warehouse.name
        return None

    def get_action(self, instance) -> str:
        return "v_invoice"

    def get_partner_name(self, instance) -> str:
        partner_name = "The Home Depot Inc"
        if instance.batch.retailer.merchant_id.upper() == "LOWES":
            partner_name = "Lowes Inc"
        return partner_name

    def get_partner_role(self, instance) -> str:
        return "vendor"

    def get_trx_currency(self, instance) -> str:
        return "USD"

    def get_trx_misc_charges(self, instance) -> str:
        return "0"

    def get_trx_discount(self, instance) -> str:
        return "0"

    def get_tax_breakout(self, instance) -> str:
        return "0"

    def get_trx_credits(self, instance) -> str:
        return "0"

    def get_credit_breakout(self, instance) -> str:
        return "0"

    def get_discount_breakout(self, instance) -> str:
        return "1"

    def get_misc_charge_breakout(self, instance) -> str:
        return "0"

    def get_carb_code(self, instance) -> str:
        return "2"

    def get_trx_shipping(self, instance) -> str:
        return "0.0"

    def get_trx_handling(self, instance) -> str:
        return "1"

    def get_trx_tax(self, instance) -> str:
        return "0.0"

    def get_disc_type_code(self, instance):
        return

    def get_disc_date_code(self, instance):
        return

    def get_disc_percent(self, instance):
        return

    def get_disc_days_due(self, instance):
        return

    def get_net_days_due(self, instance):
        return "30"

    def get_retailer_merchant_id(self, instance) -> str:
        retailer_merchant_id = instance.batch.retailer.merchant_id
        return retailer_merchant_id

    def get_tax_type(self, instance) -> str:
        return ""

    def get_alw_chg_indicator(self, instance) -> str:
        return ""

    def get_charge_type(self, instance) -> str:
        return ""


class RetailerPurchaseOrderAcknowledgeSerializer(PurchaseOrderXMLMixinSerializer):
    pass


class ShipPurchaseOrderSerializer(ReadRetailerPurchaseOrderSerializer):
    order_packages = serializers.SerializerMethodField()

    def get_order_packages(self, obj):
        list_order_package = obj.order_packages.all()
        list_order_package_unshipped = list_order_package.filter(
            shipment_packages__isnull=True
        )
        result = CustomOrderPackageSerializer(list_order_package_unshipped, many=True)
        return result.data


class RetailerPurchaseOrderBackorderSerializer(PurchaseOrderXMLMixinSerializer):
    estimated_ship_date = serializers.SerializerMethodField()
    estimated_delivery_date = serializers.SerializerMethodField()

    def get_estimated_ship_date(self, instance: RetailerPurchaseOrder) -> str:
        if instance.estimated_ship_date is None:
            raise serializers.ValidationError("Miss estimated ship date")
        return instance.estimated_ship_date.strftime(DEFAULT_SHIP_DATE_FORMAT_DATETIME)

    def get_estimated_delivery_date(self, instance: RetailerPurchaseOrder) -> str:
        if instance.estimated_delivery_date is None:
            raise serializers.ValidationError("Miss estimated_delivery_date")
        return instance.estimated_delivery_date.strftime(
            DEFAULT_SHIP_DATE_FORMAT_DATETIME
        )


class BackorderInputSerializer(serializers.Serializer):
    estimated_ship_date = serializers.DateTimeField(required=True, write_only=True)
    estimated_delivery_date = serializers.DateTimeField(required=True, write_only=True)

    def validate(self, data):
        current_time = datetime.now(timezone.utc)
        estimated_ship_date = data["estimated_ship_date"]
        estimated_delivery_date = data["estimated_delivery_date"]
        if estimated_ship_date.date() < current_time.date():
            raise ParseError("Estimated ship date must bigger than current date")
        if estimated_delivery_date.date() > estimated_ship_date.date():
            raise ParseError(
                "Estimated delivery date must smaller than estimated ship date"
            )
        return data


class RetailerPurchaseOrderConfirmationSerializer(PurchaseOrderXMLMixinSerializer):
    action = serializers.SerializerMethodField()
    action_code = serializers.SerializerMethodField()

    def get_action(self, instance: RetailerPurchaseOrder) -> str:
        return "v_ship"

    def get_action_code(self, instance: RetailerPurchaseOrder) -> str:
        return "v_ship"


class RetailerPurchaseOrderCancelSerializer(PurchaseOrderXMLMixinSerializer):
    action = serializers.SerializerMethodField()
    action_code = serializers.SerializerMethodField()

    def get_action(self, instance: RetailerPurchaseOrder) -> str:
        return "v_cancel"

    def get_action_code(self, instance: RetailerPurchaseOrder) -> str:
        # default is bad_sku, other reason will custom later
        return "bad_sku"


class CustomRetailerPurchaseOrderCancelSerializer(serializers.Serializer):
    id_item = serializers.IntegerField()
    qty = serializers.IntegerField()
    reason = serializers.CharField()


class CustomReadRetailerPurchaseOrderSerializer(ReadRetailerPurchaseOrderSerializer):
    items = CustomRetailerPurchaseOrderItemSerializer(many=True, read_only=True)


class OrganizationPurchaseOrderSerializer(serializers.ModelSerializer):
    retailers = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ["id", "retailers"]


class OrganizationPurchaseOrderCheckSerializer(OrganizationPurchaseOrderSerializer):
    @async_to_sync
    async def get_retailers(self, instance):
        # cache validation, if cache response cache data
        cache_key = CHECK_ORDER_CACHE_KEY_PREFIX.format(instance.pk)
        cache_response = cache.get(cache_key)
        if cache_response:
            return cache_response

        retailers = instance.retailer_organization.all()
        retailers = await asyncio.gather(
            *[
                self.from_retailer_to_dict(RetailerCheckOrderSerializer(retailer))
                for retailer in retailers
            ]
        )
        cache.set(cache_key, retailers)
        return retailers

    @staticmethod
    async def from_retailer_to_dict(retailer_serializer) -> dict:
        return retailer_serializer.data


class OrganizationPurchaseOrderImportSerializer(OrganizationPurchaseOrderSerializer):
    pass

    @async_to_sync
    async def get_retailers(self, instance) -> list:
        retailers = instance.retailer_organization.all()

        retailers = await asyncio.gather(
            *[self.from_retailer_import_order(retailer) for retailer in retailers]
        )

        cache_key = CHECK_ORDER_CACHE_KEY_PREFIX.format(instance.pk)

        cache_response = cache.get(cache_key)
        if cache_response:
            for retailer in cache_response:
                retailer["count"] = 0

            cache.set(cache_key, cache_response)

        return retailers

    @staticmethod
    async def from_retailer_import_order(retailer) -> dict:
        read_xml_cursors = []
        status_code = 201
        detail = "PROCESSED"
        try:
            order_batches = await sync_to_async(
                lambda: list(RetailerOrderBatch.objects.filter(retailer_id=retailer.pk))
            )()
            batch_numbers = [order_batch.batch_number for order_batch in order_batches]
            sftp_config = retailer.retailer_commercehub_sftp.__dict__
            sftp_client = CommerceHubSFTPClient(**sftp_config)
            sftp_client.connect()
            if not sftp_client.purchase_orders_sftp_directory:
                sftp_client.purchase_orders_sftp_directory = (
                    f"/outgoing/orders/{retailer.merchant_id}/"
                )
            path = (
                sftp_client.purchase_orders_sftp_directory
                if sftp_client.purchase_orders_sftp_directory[-1] == "/"
                else sftp_client.purchase_orders_sftp_directory + "/"
            )

            new_order_files = {}
            for file_xml in sftp_client.listdir_purchase_orders():
                read_xml_cursors.append(
                    read_purchase_order_xml_data(
                        sftp_client.client,
                        path,
                        file_xml,
                        batch_numbers,
                        retailer,
                    )
                )

                if "neworders" in file_xml:
                    batch_number, *_ = file_xml.split(".")
                    new_order_files[batch_number] = file_xml

            await asyncio.gather(*read_xml_cursors)
            sftp_client.close()

            # update file name to Retailer Order Batch
            if new_order_files:
                for order_batch in order_batches:
                    if (
                        not order_batch.file_name
                        and order_batch.batch_number in new_order_files
                    ):
                        order_batch.file_name = new_order_files[
                            order_batch.batch_number
                        ]

                await sync_to_async(
                    lambda: RetailerOrderBatch.objects.bulk_update(
                        order_batches, ["file_name"]
                    )
                )()

        except FolderNotFoundError:
            status_code = 404
            detail = "SFTP_FOLDER_NOT_FOUND"
            sftp_client.close()

        except RetailerOrderBatch.DoesNotExist:
            status_code = 404
            detail = "RETAILER_ORDER_BATCH_DOES_NOT_EXIST"

        except ObjectDoesNotExist:
            status_code = 404
            detail = "SFTP_CONFIG_NOT_FOUND"

        except ClientError:
            status_code = 400
            detail = "SFTP_COULD_NOT_CONNECT"

        except Exception:
            status_code = 400
            detail = "FAILED"

        return {
            "id": retailer.id,
            "status_code": status_code,
            "detail": detail,
        }


class ShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerPurchaseOrder
        fields = [
            "carrier",
            "shipping_service",
            "shipping_ref_1",
            "shipping_ref_2",
            "shipping_ref_3",
            "shipping_ref_4",
            "shipping_ref_5",
            "gs1",
        ]
        extra_kwargs = {
            "carrier": {"write_only": True},
            "shipping_service": {"write_only": True},
            "shipping_ref_1": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "shipping_ref_2": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "shipping_ref_3": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "shipping_ref_4": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "shipping_ref_5": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "gs1": {"write_only": True},
        }


class ShippingBulkSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True, write_only=True)

    class Meta:
        model = RetailerPurchaseOrder
        fields = [
            "id",
            "carrier",
            "shipping_service",
            "shipping_ref_1",
            "shipping_ref_2",
            "shipping_ref_3",
            "shipping_ref_4",
            "shipping_ref_5",
            "gs1",
        ]
        extra_kwargs = {
            "id": {"write_only": True},
            "carrier": {"write_only": True},
            "shipping_service": {"write_only": True},
            "shipping_ref_1": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "shipping_ref_2": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "shipping_ref_3": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "shipping_ref_4": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "shipping_ref_5": {
                "write_only": True,
                "allow_null": True,
                "allow_blank": True,
            },
            "gs1": {"write_only": True},
        }


class ShipToAddressValidationModelSerializer(AddressSerializer):
    carrier_id = serializers.IntegerField(write_only=True)

    def save(self, **kwargs):
        self.validated_data.pop("carrier_id")
        return super().save(**kwargs)


class ShipFromAddressSerializer(AddressSerializer):
    pass


class DailyPicklistGroupSerializer(serializers.Serializer):
    name = serializers.CharField()
    count = serializers.IntegerField(default=0)
    alias_count = serializers.IntegerField(default=0)
    quantity = serializers.IntegerField(default=0)
    total_quantity = serializers.IntegerField(default=0)


class ProductAliasQuantitySerializer(serializers.Serializer):
    order_id = serializers.IntegerField(allow_null=False)
    po_number = serializers.CharField(allow_null=False)
    quantity = serializers.IntegerField(allow_null=True)


class ProductAliasInfoSerializer(serializers.Serializer):
    product_alias_id = serializers.IntegerField(allow_null=False)
    product_alias_sku = serializers.CharField()
    packaging = serializers.IntegerField(default=0)
    list_quantity = ProductAliasQuantitySerializer(many=True, read_only=True)


class DailyPicklistSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    product_sku = serializers.CharField()
    product_alias_info = ProductAliasInfoSerializer(many=True, read_only=True)
    group = DailyPicklistGroupSerializer(many=True, read_only=True)
    quantity = serializers.IntegerField(default=0)
    available_quantity = serializers.IntegerField(default=0)
