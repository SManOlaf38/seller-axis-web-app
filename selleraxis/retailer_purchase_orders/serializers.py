import asyncio

from asgiref.sync import async_to_sync, sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from selleraxis.core.clients.sftp_client import ClientError, CommerceHubSFTPClient
from selleraxis.order_package.models import OrderPackage
from selleraxis.organizations.models import Organization
from selleraxis.retailer_order_batchs.models import RetailerOrderBatch
from selleraxis.retailer_order_batchs.serializers import RetailerOrderBatchSerializer
from selleraxis.retailer_participating_parties.serializers import (
    RetailerParticipatingPartySerializer,
)
from selleraxis.retailer_person_places.serializers import RetailerPersonPlaceSerializer
from selleraxis.retailer_purchase_order_items.serializers import (
    RetailerPurchaseOrderItemSerializer,
)
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.retailers.serializers import RetailerCheckOrderSerializer
from selleraxis.retailers.services.import_data import read_purchase_order_xml_data


class RetailerPurchaseOrderSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["view"].request.headers.get("organization", None) != str(
            data["batch"].retailer.organization.id
        ):
            raise serializers.ValidationError("Batch must is in organization")

        if self.context["view"].request.headers.get("organization", None) != str(
            data["participating_party"].retailer.organization.id
        ):
            raise serializers.ValidationError(
                "Participating party must is in organization"
            )

        if self.context["view"].request.headers.get("organization", None) != str(
            data["ship_to"].retailer.organization.id
        ):
            raise serializers.ValidationError("Ship to address must is in organization")

        if self.context["view"].request.headers.get("organization", None) != str(
            data["bill_to"].retailer.organization.id
        ):
            raise serializers.ValidationError("Bill to address must is in organization")

        if self.context["view"].request.headers.get("organization", None) != str(
            data["invoice_to"].retailer.organization.id
        ):
            raise serializers.ValidationError(
                "Invoice to address must is in organization"
            )

        if self.context["view"].request.headers.get("organization", None) != str(
            data["customer"].retailer.organization.id
        ):
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


class ReadRetailerPurchaseOrderSerializer(serializers.ModelSerializer):
    batch = RetailerOrderBatchSerializer(read_only=True)
    participating_party = RetailerParticipatingPartySerializer(read_only=True)
    ship_to = RetailerPersonPlaceSerializer(read_only=True)
    bill_to = RetailerPersonPlaceSerializer(read_only=True)
    invoice_to = RetailerPersonPlaceSerializer(read_only=True)
    customer = RetailerPersonPlaceSerializer(read_only=True)
    items = RetailerPurchaseOrderItemSerializer(many=True, read_only=True)
    verified_ship_to = RetailerPersonPlaceSerializer(read_only=True)
    packages = OrderGetPackageSerializer(many=True, read_only=True)

    class Meta:
        model = RetailerPurchaseOrder
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class OrganizationPurchaseOrderSerializer(serializers.ModelSerializer):
    retailers = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ["id", "retailers"]


class OrganizationPurchaseOrderCheckSerializer(OrganizationPurchaseOrderSerializer):
    @async_to_sync
    async def get_retailers(self, instance):
        retailers = instance.retailer_organization.all()
        retailers = await asyncio.gather(
            *[
                self.from_retailer_to_dict(RetailerCheckOrderSerializer(retailer))
                for retailer in retailers
            ]
        )
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

                RetailerOrderBatch.objects.bulk_update(order_batches, "file_name")

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
