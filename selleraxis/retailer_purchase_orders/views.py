import datetime

from django.db.models import Prefetch
from django.forms import model_to_dict
from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
    get_object_or_404,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_204_NO_CONTENT
from rest_framework.views import APIView

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.organizations.models import Organization
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_person_places.models import RetailerPersonPlace
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.retailer_purchase_orders.serializers import (
    CustomReadRetailerPurchaseOrderSerializer,
    OrganizationPurchaseOrderCheckSerializer,
    OrganizationPurchaseOrderImportSerializer,
    ReadRetailerPurchaseOrderSerializer,
    RetailerPurchaseOrderAcknowledgeSerializer,
    RetailerPurchaseOrderSerializer,
    ShippingSerializer,
)
from selleraxis.retailers.models import Retailer
from selleraxis.service_api.models import ServiceAPI, ServiceAPIAction
from selleraxis.services.models import Services
from selleraxis.shipments.models import Shipment

from .services.acknowledge_xml_handler import AcknowledgeXMLHandler
from .services.services import package_divide_service


class ListCreateRetailerPurchaseOrderView(ListCreateAPIView):
    model = RetailerPurchaseOrder
    queryset = RetailerPurchaseOrder.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["retailer_purchase_order_id", "created_at"]
    search_fields = ["retailer_purchase_order_id"]
    filterset_fields = ["batch", "batch__retailer"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderSerializer
        else:
            return RetailerPurchaseOrderSerializer

    def get_queryset(self):
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
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
        organization_id = self.request.headers.get("organization")
        mappings = {item.vendor_sku: item for item in items}
        product_aliases = ProductAlias.objects.filter(
            sku__in=mappings.keys(), retailer__organization_id=organization_id
        )
        for product_alias in product_aliases:
            if mappings.get(product_alias.sku):
                mappings[product_alias.sku].product_alias = product_alias
        error_message = None
        package_divide_data = package_divide_service(
            reset=False,
            retailer_purchase_order_id=instance.id,
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


class RetailerPurchaseOrderAcknowledgeCreateAPIView(APIView):
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

    def post(self, request, pk, *args, **kwargs):
        order = get_object_or_404(self.get_queryset(), id=pk)
        serializer_order = RetailerPurchaseOrderAcknowledgeSerializer(order)
        ack_obj = AcknowledgeXMLHandler(data=serializer_order.data)
        file, file_created = ack_obj.upload_xml_file()
        if file_created:
            return Response(status=HTTP_204_NO_CONTENT)

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
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "POST":
                return check_permission(self, Permissions.PACKAGE_DIVIDE)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        items = instance.items.all()
        organization_id = self.request.headers.get("organization")
        mappings = {item.vendor_sku: item for item in items}
        product_aliases = ProductAlias.objects.filter(
            sku__in=mappings.keys(), retailer__organization_id=organization_id
        )
        for product_alias in product_aliases:
            if mappings.get(product_alias.sku):
                mappings[product_alias.sku].product_alias = product_alias
        error_message = None
        package_divide_data = package_divide_service(
            reset=True,
            retailer_purchase_order_id=instance.id,
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
        if error_message:
            result["package_divide_error"] = error_message

        return Response(data=result, status=status.HTTP_200_OK)


class ShipToAddressValidationView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()

    def get_queryset(self):
        return self.queryset.filter(
            batch__retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        return check_permission(self, Permissions.VALIDATE_ADDRESS)

    def post(self, request, pk, *args, **kwargs):
        order = get_object_or_404(self.get_queryset(), id=pk)

        service = Services.objects.filter(name="FEDEX").first()

        login_api = ServiceAPI.objects.filter(
            service_id=service.id, action=ServiceAPIAction.LOGIN
        ).first()

        try:
            login_response = login_api.request(
                {
                    "client_id": service.general_client_id,
                    "client_secret": service.general_client_secret,
                }
            )
        except KeyError:
            return Response(
                {"error": "Login to service fail!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        address_validation_data = model_to_dict(order.ship_to)
        address_validation_data["access_token"] = login_response["access_token"]

        address_validation_api = ServiceAPI.objects.filter(
            service_id=service.id, action=ServiceAPIAction.ADDRESS_VALIDATION
        ).first()

        try:
            address_validation_response = address_validation_api.request(
                address_validation_data
            )
        except KeyError:
            return Response(
                {"error": "Address validation fail!"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        verified_ship_to = RetailerPersonPlace(
            retailer_person_place_id=order.ship_to.retailer_person_place_id,
            name=order.ship_to.name,
            address_rate_class=order.ship_to.address_rate_class,
            address_1=address_validation_response["address_1"],
            address_2=address_validation_response["address_2"],
            city=address_validation_response["city"],
            state=address_validation_response["state"],
            postal_code=address_validation_response["postal_code"],
            country=address_validation_response["country"],
            day_phone=order.ship_to.day_phone,
            night_phone=order.ship_to.night_phone,
            partner_person_place_id=order.ship_to.partner_person_place_id,
            email=order.ship_to.email,
            retailer_id=order.batch.retailer.id,
        )

        order.verified_ship_to = verified_ship_to
        verified_ship_to.save()
        order.save()

        return JsonResponse(
            {"message": "Successful!", "data": model_to_dict(verified_ship_to)},
            status=status.HTTP_200_OK,
        )


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
        order.carrier = serializer.validated_data.get("carrier")
        order.shipping_service = serializer.validated_data.get("shipping_service")
        order.shipping_ref_1 = serializer.validated_data.get("shipping_ref_1")
        order.shipping_ref_2 = serializer.validated_data.get("shipping_ref_2")
        order.shipping_ref_3 = serializer.validated_data.get("shipping_ref_3")
        order.shipping_ref_4 = serializer.validated_data.get("shipping_ref_4")
        order.shipping_ref_5 = serializer.validated_data.get("shipping_ref_5")

        order.save()
        serializer_order = ReadRetailerPurchaseOrderSerializer(order)
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

        login_api = ServiceAPI.objects.filter(
            service_id=order.carrier.service, action=ServiceAPIAction.LOGIN
        ).first()

        try:
            login_response = login_api.request(model_to_dict(order.carrier))
        except KeyError:
            return Response(
                {"error": "Login to service fail!"},
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

        shipment_list = []
        for shipment in shipping_response["shipments"]:
            shipment_list.append(
                Shipment(
                    tracking_number=shipment["tracking_number"],
                    package_document=shipment["package_document"],
                )
            )

        Shipment.objects.bulk_create(shipment_list)

        return JsonResponse(
            {
                "message": "Successful!",
                "data": [model_to_dict(shipment) for shipment in shipment_list],
            },
            status=status.HTTP_200_OK,
        )
