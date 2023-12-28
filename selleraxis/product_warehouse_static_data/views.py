import json

from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from selleraxis.core.clients.boto3_client import sqs_client
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.core.utils import DataUtilities
from selleraxis.core.views import BulkUpdateAPIView
from selleraxis.permissions.models import Permissions
from selleraxis.product_warehouse_static_data.services import (
    send_all_retailer_id_sqs,
    send_retailer_id_sqs,
)

from ..core.custom_permission import CustomPermission
from ..retailer_warehouse_products.models import RetailerWarehouseProduct
from .models import ProductWarehouseStaticData
from .serializers import (
    BulkProductWarehouseStaticDataSerializer,
    ProductWarehouseStaticDataSerializer,
)


class ListCreateProductWarehouseStaticDataView(ListCreateAPIView):
    model = ProductWarehouseStaticData
    serializer_class = ProductWarehouseStaticDataSerializer
    queryset = ProductWarehouseStaticData.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination

    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["status", "created_at"]
    search_fields = ["status"]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case _:
                return check_permission(
                    self, Permissions.CREATE_PRODUCT_WAREHOUSE_STATIC_DATA
                )

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(
            product_warehouse__product_alias__retailer__organization_id=organization_id
        )

    def perform_create(self, serializer):
        serializer.save()
        dict_data = [
            {
                "retailer_id": serializer.instance.product_warehouse.product_alias.retailer.id,
                "product_alias_ids": str(
                    serializer.instance.product_warehouse.product_alias.id
                ),
            }
        ]
        message_body = json.dumps(dict_data)
        sqs_client.create_queue(
            message_body=message_body,
            queue_name=settings.SQS_UPDATE_INVENTORY_TO_COMMERCEHUB_SQS_NAME,
        )
        return serializer


class UpdateDeleteProductWarehouseStaticDataView(RetrieveUpdateDestroyAPIView):
    model = ProductWarehouseStaticData
    serializer_class = ProductWarehouseStaticDataSerializer
    lookup_field = "id"
    queryset = ProductWarehouseStaticData.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case _:
                return check_permission(
                    self, Permissions.UPDATE_PRODUCT_WAREHOUSE_STATIC_DATA
                )

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(
            product_warehouse__product_alias__retailer__organization_id=organization_id
        )


class BulkUpdateDeleteProductWarehouseStaticDataView(BulkUpdateAPIView):
    queryset = ProductWarehouseStaticData.objects.all()
    serializer_class = BulkProductWarehouseStaticDataSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_PRODUCT_WAREHOUSE_STATIC_DATA
                )
            case _:
                return check_permission(
                    self, Permissions.UPDATE_PRODUCT_WAREHOUSE_STATIC_DATA
                )

    def perform_update(self, serializer):
        serializer.save()
        data = serializer.data
        product_warehouse_ids = [item["product_warehouse_id"] for item in data]
        list_product_warehouse = RetailerWarehouseProduct.objects.filter(
            id__in=product_warehouse_ids
        )
        product_alias_list = [item.product_alias for item in list_product_warehouse]
        product_alias_objects = {}
        for product_alias in product_alias_list:
            retailer_id = product_alias.retailer.id
            if retailer_id not in product_alias_objects:
                product_alias_objects[retailer_id] = []
            product_alias_objects[retailer_id].append(product_alias.id)

        data_send_sqs = []
        product_alias_objects = DataUtilities.convert_list_id_to_unique(
            product_alias_objects
        )

        for key, value in product_alias_objects.items():
            dict_data = {
                "retailer_id": key,
                "product_alias_ids": ",".join(map(str, value)),
            }
            data_send_sqs.append(dict_data)
        message_body = json.dumps(data_send_sqs)
        sqs_client.create_queue(
            message_body=message_body,
            queue_name=settings.SQS_UPDATE_INVENTORY_TO_COMMERCEHUB_SQS_NAME,
        )


class GetRetailerToUpdateInventoryView(APIView):
    permission_classes = [CustomPermission]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "product_warehouse_static_ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            ),
            # ... add more parameters as needed ...
        ]
    )
    def get(self, request):
        ids = request.query_params.get("product_warehouse_static_ids")
        if ids is not None:
            list_ids = ids.split(",")
            send_retailer_id_sqs(list_ids)
        else:
            send_all_retailer_id_sqs()
        return Response("data has been sent to sqs!")
