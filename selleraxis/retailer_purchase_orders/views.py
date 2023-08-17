import asyncio
import base64
import copy
import datetime
from typing import List

from asgiref.sync import async_to_sync, sync_to_async
from django.conf import settings
from django.db.models import Count, F, Prefetch, Sum
from django.forms import model_to_dict
from django.utils.timezone import make_aware
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import APIException, ParseError, ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    CreateAPIView,
    GenericAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
    get_object_or_404,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT
from rest_framework.views import APIView

from selleraxis.core.clients.boto3_client import s3_client
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.order_verified_address.models import OrderVerifiedAddress
from selleraxis.organizations.models import Organization
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.models import Product
from selleraxis.retailer_carriers.models import RetailerCarrier
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_orders.models import (
    QueueStatus,
    RetailerPurchaseOrder,
)
from selleraxis.retailer_purchase_orders.serializers import (
    CustomReadRetailerPurchaseOrderSerializer,
    DailyPicklistSerializer,
    OrganizationPurchaseOrderCheckSerializer,
    OrganizationPurchaseOrderImportSerializer,
    ReadRetailerPurchaseOrderSerializer,
    RetailerPurchaseOrderAcknowledgeSerializer,
    RetailerPurchaseOrderSerializer,
    ShipFromAddressSerializer,
    ShippingSerializer,
    ShipToAddressValidationModelSerializer,
)
from selleraxis.retailer_queue_histories.models import RetailerQueueHistory
from selleraxis.retailers.models import Retailer
from selleraxis.service_api.models import ServiceAPI, ServiceAPIAction
from selleraxis.shipments.models import Shipment, ShipmentStatus
from selleraxis.shipments.services import (
    extract_substring,
    generate_numbers,
    get_next_sscc_value,
)
from selleraxis.shipping_service_types.models import ShippingServiceType

from .services.acknowledge_xml_handler import AcknowledgeXMLHandler
from .services.services import package_divide_service


class ListCreateRetailerPurchaseOrderView(ListCreateAPIView):
    model = RetailerPurchaseOrder
    queryset = RetailerPurchaseOrder.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["retailer_purchase_order_id", "created_at"]
    search_fields = ["status", "batch__retailer_name"]
    filterset_fields = ["status", "batch__retailer__name"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderSerializer
        else:
            return RetailerPurchaseOrderSerializer

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
            )
            .prefetch_related("items")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PURCHASE_ORDER)
            case _:
                return check_permission(
                    self, Permissions.CREATE_RETAILER_PURCHASE_ORDER
                )


class UpdateDeleteRetailerPurchaseOrderView(RetrieveUpdateDestroyAPIView):
    model = RetailerPurchaseOrder
    lookup_field = "id"
    queryset = RetailerPurchaseOrder.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderSerializer
        else:
            return RetailerPurchaseOrderSerializer

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
            )
            .prefetch_related("items")
        )

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        items = instance.items.all()
        mappings = {item.merchant_sku: item for item in items}
        product_aliases = ProductAlias.objects.filter(
            merchant_sku__in=mappings.keys(),
            retailer_id=instance.batch.retailer_id,
        )
        for product_alias in product_aliases:
            if mappings.get(product_alias.merchant_sku):
                mappings[product_alias.merchant_sku].product_alias = product_alias
        error_message = None
        package_divide_data = package_divide_service(
            reset=False,
            retailer_purchase_order=instance,
            retailer_id=instance.batch.retailer_id,
        )
        serializer = CustomReadRetailerPurchaseOrderSerializer(instance)

        result = serializer.data
        if package_divide_data.get("status") != 200:
            error_data = package_divide_data.get("data")
            error_message = error_data.get("message")
        else:
            for order_package_item in result.get("order_packages"):
                for divide_data in package_divide_data.get("data"):
                    if order_package_item.get("id") == divide_data.get(
                        "order_package_id"
                    ):
                        order_package_item["box_max_quantity"] = divide_data.get(
                            "max_quantity"
                        )
        for order_package_item in result.get("order_packages"):
            remain = order_package_item.get("box_max_quantity", 0)
            if remain > 0:
                for order_item in order_package_item.get("order_item_packages"):
                    remain = remain - order_item.get("quantity") * order_item.get(
                        "retailer_purchase_order_item"
                    ).get("product_alias").get("sku_quantity")
            order_package_item["remain"] = remain
        result.get("order_packages").sort(key=lambda x: x["remain"], reverse=False)
        if error_message:
            result["package_divide_error"] = error_message

        return Response(data=result, status=status.HTTP_200_OK)

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PURCHASE_ORDER)
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_RETAILER_PURCHASE_ORDER
                )
            case _:
                return check_permission(
                    self, Permissions.UPDATE_RETAILER_PURCHASE_ORDER
                )


class RetailerPurchaseOrderXMLAPIView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
                "carrier",
            )
            .prefetch_related("items")
        )

    def create_queue_history(
        self, order: RetailerPurchaseOrder, label: str
    ) -> RetailerQueueHistory:
        return RetailerQueueHistory.objects.create(
            retailer_id=order.batch.retailer.id,
            type=order.batch.retailer.type,
            status=RetailerQueueHistory.Status.PENDING,
            label=RetailerQueueHistory.Label.ACKNOWLEDGMENT,
        )


class RetailerPurchaseOrderAcknowledgeCreateAPIView(RetailerPurchaseOrderXMLAPIView):
    def post(self, request, pk, *args, **kwargs):
        order = get_object_or_404(self.get_queryset(), id=pk)
        queue_history_obj = self.create_queue_history(
            order=order, label=RetailerQueueHistory.Label.ACKNOWLEDGMENT
        )
        ack_obj = self.create_acknowledge(
            order=order, queue_history_obj=queue_history_obj
        )
        if ack_obj:
            return Response(data=ack_obj.data, status=HTTP_204_NO_CONTENT)

        queue_history_obj.status = RetailerQueueHistory.Status.FAILED
        queue_history_obj.save()
        raise ValidationError("Could not create Acknowledge XML file to SFTP.")

    def create_acknowledge(
        self, order: RetailerPurchaseOrder, queue_history_obj: RetailerQueueHistory
    ) -> AcknowledgeXMLHandler | None:
        serializer_order = RetailerPurchaseOrderAcknowledgeSerializer(order)
        ack_obj = AcknowledgeXMLHandler(data=serializer_order.data)
        file, file_created = ack_obj.upload_xml_file(False)
        if file_created:
            s3_response = s3_client.upload_file(
                filename=ack_obj.localpath, bucket=settings.BUCKET_NAME
            )
            if s3_response.ok:
                order.status = QueueStatus.Acknowledged.value
                order.save()
                queue_history_obj.status = RetailerQueueHistory.Status.COMPLETED
                queue_history_obj.result_url = s3_response.data
                queue_history_obj.save()

            # remove XML file on localhost path
            ack_obj.remove_xml_file_localpath()
            return ack_obj

        return None


class RetailerPurchaseOrderAcknowledgeBulkCreateAPIView(
    RetailerPurchaseOrderAcknowledgeCreateAPIView
):
    pass

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "retailer_purchase_order_ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            ),
        ]
    )
    def post(self, request, *args, **kwargs):
        purchase_order_ids = request.query_params.get(
            "retailer_purchase_order_ids", None
        )
        if purchase_order_ids:
            purchase_order_ids = purchase_order_ids.split(",")

        purchase_orders = (
            RetailerPurchaseOrder.objects.filter(
                pk__in=purchase_order_ids,
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                ),
            )
            .select_related(
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
                "carrier",
            )
            .prefetch_related("items")
        )

        if len(purchase_order_ids) != purchase_orders.count():
            raise ParseError("Purchase order ids doesn't match!")

        responses = self.bulk_create(purchase_orders=list(purchase_orders))
        return Response(data=responses, status=HTTP_201_CREATED)

    @async_to_sync
    async def bulk_create(
        self, purchase_orders: List[RetailerPurchaseOrder]
    ) -> List[dict]:
        tasks = []
        for purchase_order in purchase_orders:
            tasks.append(sync_to_async(self.create_task)(purchase_order))

        responses = await asyncio.gather(*tasks)
        return responses

    def create_task(self, purchase_order: RetailerPurchaseOrder) -> dict:
        queue_history_obj = self.create_queue_history(
            order=purchase_order, label=RetailerQueueHistory.Label.ACKNOWLEDGMENT
        )
        ack_obj = self.create_acknowledge(purchase_order, queue_history_obj)
        response = {}
        if ack_obj:
            response[purchase_order.pk] = RetailerQueueHistory.Status.COMPLETED.value
            purchase_order.status = QueueStatus.Acknowledged.value
            purchase_order.save()
        else:
            queue_history_obj.status = RetailerQueueHistory.Status.FAILED
            queue_history_obj.save()
            response[purchase_order.pk] = RetailerQueueHistory.Status.FAILED.value
        return response


class RetailerPurchaseOrderShipmentConfirmationCreateAPIView(
    RetailerPurchaseOrderXMLAPIView
):
    def post(self, request, pk, *args, **kwargs):
        order = get_object_or_404(self.get_queryset(), id=pk)
        queue_history_obj = self.create_queue_history(
            order=order, label=RetailerQueueHistory.Label.CONFIRM
        )
        queue_history_obj.status = RetailerQueueHistory.Status.FAILED
        queue_history_obj.save()
        raise ValidationError("Could not create Acknowledge XML file to SFTP.")


class OrganizationPurchaseOrderRetrieveAPIView(RetrieveAPIView):
    queryset = Organization.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.get_queryset().get()

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(pk=organization_id).prefetch_related(
            Prefetch(
                "retailer_organization",
                queryset=Retailer.objects.prefetch_related(
                    "retailer_order_batch"
                ).select_related("retailer_commercehub_sftp"),
            )
        )


class OrganizationPurchaseOrderCheckView(OrganizationPurchaseOrderRetrieveAPIView):
    serializer_class = OrganizationPurchaseOrderCheckSerializer


class OrganizationPurchaseOrderImportView(OrganizationPurchaseOrderRetrieveAPIView):
    serializer_class = OrganizationPurchaseOrderImportSerializer


class PackageDivideResetView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderSerializer

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
            )
            .prefetch_related("items")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "POST":
                return check_permission(self, Permissions.PACKAGE_DIVIDE)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        items = instance.items.all()
        mappings = {item.merchant_sku: item for item in items}
        product_aliases = ProductAlias.objects.filter(
            merchant_sku__in=mappings.keys(),
            retailer_id=instance.batch.retailer_id,
        )
        for product_alias in product_aliases:
            if mappings.get(product_alias.merchant_sku):
                mappings[product_alias.merchant_sku].product_alias = product_alias
        error_message = None
        package_divide_data = package_divide_service(
            reset=True,
            retailer_purchase_order=instance,
            retailer_id=instance.batch.retailer_id,
        )
        serializer = CustomReadRetailerPurchaseOrderSerializer(instance)

        result = serializer.data
        if package_divide_data.get("status") != 200:
            error_data = package_divide_data.get("data")
            error_message = error_data.get("message")
        else:
            for order_package_item in result.get("order_packages"):
                for divide_data in package_divide_data.get("data"):
                    if order_package_item.get("id") == divide_data.get(
                        "order_package_id"
                    ):
                        order_package_item["box_max_quantity"] = divide_data.get(
                            "max_quantity"
                        )
        for order_package_item in result.get("order_packages"):
            remain = order_package_item.get("box_max_quantity", 0)
            if remain > 0:
                for order_item in order_package_item.get("order_item_packages"):
                    remain = remain - order_item.get("quantity") * order_item.get(
                        "retailer_purchase_order_item"
                    ).get("product_alias").get("sku_quantity")
            order_package_item["remain"] = remain
        result.get("order_packages").sort(key=lambda x: x["remain"], reverse=False)
        if error_message:
            result["package_divide_error"] = error_message

        return Response(data=result, status=status.HTTP_200_OK)


class ShipFromAddressView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()
    serializer_class = ShipFromAddressSerializer

    def get_queryset(self):
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
        ).select_related("ship_from")

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.update_or_create(serializer)

    def update_or_create(self, serializer):
        order = self.get_object()
        instance = order.ship_from
        action_status = str(serializer.validated_data["status"]).upper()
        if action_status == OrderVerifiedAddress.Status.ORIGIN.value:
            self.revert_ship_from(order=order)
        else:
            for field, value in serializer.validated_data.items():
                if field in serializer.validated_data:
                    serializer.validated_data[field] = value

                if instance and hasattr(instance, field):
                    setattr(instance, field, value)

            if isinstance(instance, OrderVerifiedAddress):
                instance.company = serializer.validated_data["company"]
                instance.contact_name = serializer.validated_data["contact_name"]
                instance.save()
            else:
                instance = serializer.save()
                order.ship_from = instance
                order.save()

        return Response(data=model_to_dict(order.ship_from), status=HTTP_201_CREATED)

    @staticmethod
    def revert_ship_from(order: RetailerPurchaseOrder) -> None:
        if not order.batch.retailer.default_warehouse:
            raise ValidationError(
                "Not found the default warehouse address information."
            )

        retailer_warehouse = order.batch.retailer.default_warehouse
        instance = order.ship_from
        if isinstance(instance, OrderVerifiedAddress):
            for key, value in retailer_warehouse.__dict__.items():
                if hasattr(order.ship_from, key):
                    setattr(order.ship_from, key, value)

        else:
            write_fields = {
                key: value
                for key, value in retailer_warehouse.__dict__.items()
                if hasattr(OrderVerifiedAddress, key)
            }
            instance = OrderVerifiedAddress(**write_fields)

        instance.contact_name = retailer_warehouse.name
        instance.status = OrderVerifiedAddress.Status.ORIGIN
        instance.save()
        order.ship_from = instance
        order.save()


class ShipToAddressValidationView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()
    serializer_class = ShipToAddressValidationModelSerializer

    def get_queryset(self):
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
        ).select_related("verified_ship_to")

    def check_permissions(self, _):
        return check_permission(self, Permissions.VALIDATE_ADDRESS)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action_status = str(serializer.validated_data["status"]).upper()
        if action_status in [
            serializer.Meta.model.Status.ORIGIN.value,
            serializer.Meta.model.Status.EDITED.value,
        ]:
            return self.revert_or_edit(
                serializer=serializer, action_status=action_status
            )

        carrier_id = serializer.validated_data["carrier_id"]
        carrier = get_object_or_404(
            RetailerCarrier.objects.filter(
                retailer__organization_id=self.request.headers.get("organization")
            ),
            pk=carrier_id,
        )
        if carrier is None:
            raise ValidationError(
                {"error": "Carrier is not defined"}, code=status.HTTP_400_BAD_REQUEST
            )

        origin_string = f"{carrier.client_id}:{carrier.client_secret}"
        to_binary = origin_string.encode("UTF-8")
        basic_auth = (base64.b64encode(to_binary)).decode("ascii")

        login_api = ServiceAPI.objects.filter(
            service_id=carrier.service, action=ServiceAPIAction.LOGIN
        ).first()

        try:
            login_response = login_api.request(
                {
                    "client_id": carrier.client_id,
                    "client_secret": carrier.client_secret,
                    "basic_auth": basic_auth,
                }
            )
        except KeyError:
            raise ValidationError(
                {"error": "Login to service fail!"},
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        address_validation_data = copy.deepcopy(serializer.validated_data)
        address_validation_data["access_token"] = login_response["access_token"]

        address_validation_api = ServiceAPI.objects.filter(
            service_id=carrier.service, action=ServiceAPIAction.ADDRESS_VALIDATION
        ).first()

        try:
            address_validation_response = address_validation_api.request(
                address_validation_data
            )
        except KeyError:
            raise ValidationError(
                {"error": "Address validation fail!"},
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if (
            "address_1" not in address_validation_response
            and str(address_validation_response.get("status")).lower() != "success"
        ):
            raise ValidationError(
                {
                    "error": "Address validation fail!",
                    "status": address_validation_response["status"].lower(),
                },
                code=status.HTTP_400_BAD_REQUEST,
            )

        order = self.get_object()
        instance = order.verified_ship_to
        for field, value in address_validation_response.items():
            if field in serializer.validated_data:
                serializer.validated_data[field] = value

            if instance and hasattr(instance, field):
                setattr(instance, field, value)

        if isinstance(instance, OrderVerifiedAddress):
            instance.company = serializer.validated_data["company"]
            instance.contact_name = serializer.validated_data["contact_name"]
            instance.save()
        else:
            instance = serializer.save()

        order.verified_ship_to = instance
        order.carrier = carrier
        order.save()
        return Response(
            data=model_to_dict(order.verified_ship_to), status=HTTP_201_CREATED
        )

    def revert_or_edit(self, serializer, action_status: str):
        order = self.get_object()
        instance = order.verified_ship_to
        if not isinstance(instance, OrderVerifiedAddress):
            instance = serializer.save()
        else:
            if action_status == serializer.Meta.model.Status.ORIGIN.value:
                ship_to = order.ship_to
                instance.company = ship_to.company
                instance.contact_name = ship_to.name
                instance.address_1 = ship_to.address_1
                instance.address_2 = ship_to.address_2
                instance.city = ship_to.city
                instance.state = ship_to.state
                instance.country = ship_to.country
                instance.postal_code = ship_to.postal_code
                instance.phone = ship_to.day_phone
                instance.status = action_status
            else:
                for field, value in serializer.validated_data.items():
                    if instance and hasattr(instance, field):
                        setattr(instance, field, value)

            instance.save()

        order.verified_ship_to = instance
        order.save()
        return Response(data=model_to_dict(order.verified_ship_to), status=HTTP_200_OK)


class ShippingView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()
    serializer_class = ReadRetailerPurchaseOrderSerializer()

    def get_serializer(self, *args, **kwargs):
        return ShippingSerializer(*args, **kwargs)

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
                "carrier",
            )
            .prefetch_related("items")
        )

    def check_permissions(self, _):
        return check_permission(self, Permissions.CREATE_SHIPPING)

    def post(self, request, pk, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = get_object_or_404(self.get_queryset(), id=pk)
        return self.create_shipping(order=order, serializer=serializer)

    def create_shipping(
        self, order: RetailerPurchaseOrder, serializer: ShippingSerializer
    ):
        try:
            organization = Organization.objects.get(
                id=self.request.headers.get("organization")
            )
        except Organization.DoesNotExist:
            raise ParseError("Organzation does not exist")

        if organization.gs1 == "":
            return Response(
                {"error": "SSCC prefix does not exist!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.carrier = serializer.validated_data.get("carrier")
        order.shipping_service = serializer.validated_data.get("shipping_service")
        order.shipping_ref_1 = serializer.validated_data.get("shipping_ref_1")
        order.shipping_ref_2 = serializer.validated_data.get("shipping_ref_2")
        order.shipping_ref_3 = serializer.validated_data.get("shipping_ref_3")
        order.shipping_ref_4 = serializer.validated_data.get("shipping_ref_4")
        order.shipping_ref_5 = serializer.validated_data.get("shipping_ref_5")

        order.save()
        serializer_order = ReadRetailerPurchaseOrderSerializer(order)
        if order.status == QueueStatus.Shipping.value:
            return Response(
                {"error": "Order has been shipped!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(serializer_order.data["order_packages"]) == 0:
            return Response(
                {"error": "Order Package has not been created yet"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if serializer_order.data["carrier"]["shipper"] is None:
            return Response(
                {"error": "Shipper has not been created yet"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if order.carrier is None:
            return Response(
                {"error": "Carrier is not defined"}, status=status.HTTP_400_BAD_REQUEST
            )

        if order.verified_ship_to is None:
            return Response(
                {"error": "Ship to address was not verified"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        origin_string = f"{order.carrier.client_id}:{order.carrier.client_secret}"
        to_binary = origin_string.encode("UTF-8")
        basic_auth = (base64.b64encode(to_binary)).decode("ascii")

        login_api = ServiceAPI.objects.filter(
            service_id=order.carrier.service, action=ServiceAPIAction.LOGIN
        ).first()

        try:
            login_response = login_api.request(
                {
                    "client_id": order.carrier.client_id,
                    "client_secret": order.carrier.client_secret,
                    "basic_auth": basic_auth,
                }
            )
        except KeyError:
            return Response(
                {"error": "Login to service fail!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        try:
            shipping_service_type = ShippingServiceType.objects.get(
                code=order.shipping_service, service=order.carrier.service
            )
        except ShippingServiceType.DoesNotExist:
            return Response(
                {"error": "Ship service not found!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        shipping_data = ReadRetailerPurchaseOrderSerializer(order).data
        shipping_data["access_token"] = login_response["access_token"]
        shipping_data["datetime"] = datetime

        shipping_api = ServiceAPI.objects.filter(
            service_id=order.carrier.service, action=ServiceAPIAction.SHIPPING
        ).first()

        try:
            shipping_response = shipping_api.request(shipping_data)
        except KeyError:
            return Response(
                {"error": "Shipping fail!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        newest_shipment = Shipment.objects.order_by("-created_at").first()
        if newest_shipment is None or newest_shipment.sscc == "":
            sscc_var = 30000
        else:
            sscc_var = extract_substring(newest_shipment.sscc, 7, 5)
            sscc_var = int(sscc_var) + 1
        sscc_var_list = generate_numbers(sscc_var, len(shipping_response["shipments"]))
        shipment_list = []
        for i, shipment in enumerate(shipping_response["shipments"]):
            shipment_list.append(
                Shipment(
                    status=ShipmentStatus.CREATED,
                    tracking_number=shipment["tracking_number"],
                    package_document=shipment["package_document"],
                    sscc=get_next_sscc_value(sscc_var_list[i], organization.gs1),
                    sender_country=order.ship_from.country
                    if order.ship_from
                    else order.carrier.shipper.country,
                    identification_number=shipping_response["identification_number"]
                    if "identification_number" in shipping_response
                    else "",
                    carrier=order.carrier,
                    package_id=serializer_order.data["order_packages"][i]["id"],
                    type=shipping_service_type,
                )
            )
        Shipment.objects.bulk_create(shipment_list)
        order.status = QueueStatus.Shipping.value
        order.save()
        return Response(
            data=[model_to_dict(shipment) for shipment in shipment_list],
            status=status.HTTP_200_OK,
        )


class ShippingBulkCreateAPIView(ShippingView):
    def post(self, request, *args, **kwargs):
        if isinstance(request.data, dict):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            order = get_object_or_404(self.get_queryset(), id=request.data["id"])
            return self.create_shipping(order=order, serializer=serializer)

        data_serializers = {data["id"]: data for data in request.data if "id" in data}
        purchase_orders = (
            RetailerPurchaseOrder.objects.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                ),
                pk__in=data_serializers.keys(),
            )
            .select_related(
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
                "carrier",
            )
            .prefetch_related("items")
        )

        if len(request.data) != purchase_orders.count():
            raise ParseError("Purchase order ids doesn't match!")

        errors = {}
        serializers = []
        for purchase_order in purchase_orders:
            data = data_serializers.get(purchase_order.pk)
            serializer = self.get_serializer(purchase_order, data=data)
            if serializer.is_valid():
                serializers.append(serializer)
            else:
                errors[purchase_order.pk] = {
                    "error": {
                        "default_code": "input_body_invalid",
                        "status_code": 400,
                        "detail": "Unprocessable Entity",
                    }
                }

        responses = self.bulk_create(serializers=serializers)
        data = {}
        for i, response in enumerate(responses):
            if isinstance(response, Response):
                data[serializers[i].instance.pk] = response.data

            elif isinstance(response, APIException):
                data[serializers[i].instance.pk] = {
                    "error": {
                        "default_code": "request_carrier_api_error",
                        "status_code": response.status_code,
                        "detail": response.detail,
                    }
                }
            else:
                data[serializers[i].instance.pk] = {
                    "error": {
                        "default_code": "unknown_error",
                        "status_code": 400,
                        "detail": "Please contact the administrator for more information",
                    }
                }

        if errors:
            data.update(errors)

        response_data = []
        for purchase_order in purchase_orders:
            response = {
                "id": purchase_order.pk,
                "po_number": purchase_order.po_number,
                "data": data[purchase_order.pk],
                "status": "FAILED"
                if "error" in data[purchase_order.pk]
                else "COMPLETED",
            }
            response_data.append(response)
        return Response(data=response_data, status=HTTP_201_CREATED)

    @async_to_sync
    async def bulk_create(self, serializers: List[ShippingSerializer]) -> List[dict]:
        tasks = []
        for serializer in serializers:
            tasks.append(
                sync_to_async(self.create_shipping)(serializer.instance, serializer)
            )

        responses = await asyncio.gather(*tasks, return_exceptions=True)
        return responses


class DailyPicklistAPIView(ListAPIView):
    queryset = RetailerPurchaseOrderItem.objects.all()
    serializer_class = DailyPicklistSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["created_at"]

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        items = self.queryset.filter(
            order__batch__retailer__organization_id=organization_id
        )
        if "created_at" in self.request.query_params:
            created_at = self.request.query_params.get("created_at")
            created_at_gte = make_aware(
                datetime.datetime.strptime(created_at, "%Y-%m-%d")
            )
            created_at_lte = created_at_gte + datetime.timedelta(days=1)
            items = items.filter(
                created_at__gte=created_at_gte, created_at__lte=created_at_lte
            )

        queryset = (
            Product.objects.filter(
                products_aliases__merchant_sku__in=items.values_list(
                    "merchant_sku", flat=True
                ).distinct(),
                products_aliases__retailer__organization_id=organization_id,
            )
            .values(product_sku=F("sku"), quantity=F("products_aliases__sku_quantity"))
            .annotate(
                id=F("pk"),
                name=F("quantity"),
                count=Count("product_sku"),
                total_quantity=(F("quantity") * F("count")),
                available_quantity=Sum("qty_on_hand"),
            )
            .order_by("quantity")
            .distinct()
        )
        return queryset

    def get(self, request, *args, **kwargs):
        serializers = self.get_serializer(self.to_table_data(), many=True)
        return Response(data=serializers.data)

    def to_table_data(self):
        instances = self.get_queryset()
        hash_instances = {}
        quantities = []
        for instance in instances:
            product_sku = instance["product_sku"]
            total_quantity = instance["total_quantity"]
            quantity = instance["quantity"]
            available_quantity = instance["available_quantity"]
            instance.pop("available_quantity")
            instance.pop("product_sku")
            data = {"id": instance["id"]}
            if product_sku not in hash_instances:
                data["product_sku"] = product_sku
                data["group"] = [instance]
                data["quantity"] = total_quantity
                data["available_quantity"] = available_quantity
                hash_instances[product_sku] = data
            else:
                hash_instances[product_sku]["group"].append(instance)
                hash_instances[product_sku]["quantity"] += total_quantity
                hash_instances[product_sku]["available_quantity"] += available_quantity

            if quantity not in quantities:
                quantities.append(quantity)

        return self.reprocess_table_data(hash_instances, quantities)

    def reprocess_table_data(self, hash_instances, quantities) -> List[dict]:
        for key in hash_instances:
            groups = hash_instances[key]["group"]
            group_quantities = [group["quantity"] for group in groups]
            for quantity in quantities:
                if quantity not in group_quantities:
                    groups.append(
                        {
                            "name": quantity,
                            "quantity": quantity,
                            "count": 0,
                            "total_quantity": 0,
                        }
                    )

            sorted_groups = sorted(groups, key=lambda x: x["quantity"])
            hash_instances[key]["group"] = sorted_groups
        return hash_instances.values()
