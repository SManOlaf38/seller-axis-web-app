import json

from django.conf import settings
from django.db.models import OuterRef, Subquery
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    CreateAPIView,
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.clients.boto3_client import sqs_client
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.core.views import BulkUpdateAPIView
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.exceptions import (
    DeleteAliasException,
    ImportMerchantSKUException,
    ProductAliasAlreadyExists,
    ProductNotFound,
    PutAliasException,
    RawDataIsEmptyArray,
    RetailerNotFound,
    UPCAlreadyExists,
    WarehouseNotFound,
)
from selleraxis.product_alias.models import ProductAlias
from selleraxis.product_alias.serializers import (
    BulkCreateProductAliasSerializer,
    BulkUpdateProductAliasSerializer,
    ProductAliasInventorySerializer,
    ProductAliasSerializer,
    ReadProductAliasSerializer,
)
from selleraxis.product_alias.services import delete_product_alias
from selleraxis.product_warehouse_static_data.models import ProductWarehouseStaticData
from selleraxis.products.models import Product
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_orders.models import QueueStatus
from selleraxis.retailer_queue_histories.models import RetailerQueueHistory
from selleraxis.retailer_suggestion.models import RetailerSuggestion
from selleraxis.retailer_warehouse_products.models import RetailerWarehouseProduct
from selleraxis.retailer_warehouses.models import RetailerWarehouse
from selleraxis.retailers.models import Retailer


class ListCreateProductAliasView(ListCreateAPIView):
    model = ProductAlias
    serializer_class = ProductAliasSerializer
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = [
        "sku",
        "product__sku",
        "sku_quantity",
        "merchant_sku",
        "vendor_sku",
        "retailer__name",
        "upc",
        "created_at",
        "product__available",
    ]
    search_fields = ["merchant_sku", "retailer__name", "sku", "vendor_sku", "upc"]
    filterset_fields = ["retailer__name"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductAliasSerializer
        return ProductAliasSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_ALIAS)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT_ALIAS)

    def get_queryset(self):
        retailer_queue_history_subquery = (
            RetailerQueueHistory.objects.filter(
                label=RetailerQueueHistory.Label.INVENTORY,
                retailer=OuterRef("retailer__id"),
            )
            .order_by("-created_at")
            .values("result_url")[:1]
        )
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(retailer__organization_id=organization_id).annotate(
            last_queue_history=Subquery(retailer_queue_history_subquery)
        )


class UpdateDeleteProductAliasView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductAliasSerializer
    lookup_field = "id"
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductAliasSerializer
        return ProductAliasSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_ALIAS)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT_ALIAS)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT_ALIAS)

    def get_queryset(self):
        retailer_queue_history_subquery = (
            RetailerQueueHistory.objects.filter(
                label=RetailerQueueHistory.Label.INVENTORY,
                retailer=OuterRef("retailer__id"),
            )
            .order_by("-created_at")
            .values("result_url")[:1]
        )
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(retailer__organization_id=organization_id).annotate(
            last_queue_history=Subquery(retailer_queue_history_subquery)
        )

    def perform_update(self, serializer):
        id = self.kwargs["id"]
        product_alias = ProductAlias.objects.filter(id=id).first()
        po_items = RetailerPurchaseOrderItem.objects.filter(
            merchant_sku=product_alias.merchant_sku,
            order__batch__retailer_id=product_alias.retailer.id,
        )
        orders = [po_item.order for po_item in po_items]
        filter_orders = []
        for order in orders:
            if (
                order.status == QueueStatus.Opened
                or order.status == QueueStatus.Acknowledged
                or order.status == QueueStatus.Bypassed_Acknowledge
                or order.status == QueueStatus.Backorder
            ):
                filter_orders.append(order.id)
        if len(filter_orders) > 0:
            raise PutAliasException
        serializer.save()

    def delete(self, request, *args, **kwargs):
        id = self.kwargs["id"]
        if delete_product_alias(id):
            ProductAlias.objects.filter(id=id).delete()
        return Response(status=status.HTTP_200_OK)


class BulkDeleteProductAliasView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            )
        ]
    )
    def delete(self, request, *args, **kwargs):
        ids = request.query_params.get("ids")
        organization_id = self.request.headers.get("organization")
        if ids:
            list_id = ids.split(",")
            product_alias_list = ProductAlias.objects.filter(
                id__in=list_id, retailer__organization_id=organization_id
            )
            merchant_sku = []
            retailer_ids = []
            for product_alias in product_alias_list:
                merchant_sku.append(product_alias.merchant_sku)
                retailer_ids.append(product_alias.retailer.id)
            po_items = RetailerPurchaseOrderItem.objects.filter(
                merchant_sku__in=merchant_sku,
                order__batch__retailer_id__in=retailer_ids,
            )
            po_order = []
            for po_item in po_items:
                if (
                    po_item.order.status == QueueStatus.Opened
                    or po_item.order.status == QueueStatus.Acknowledged
                    or po_item.order.status == QueueStatus.Bypassed_Acknowledge
                    or po_item.order.status == QueueStatus.Backorder
                ):
                    po_order.append(po_item.order)
            if len(po_order) > 0:
                raise DeleteAliasException
            ProductAlias.objects.filter(
                id__in=list_id, retailer__organization_id=organization_id
            ).delete()
        return Response(
            data={"data": "Product aliases deleted successfully"},
            status=status.HTTP_200_OK,
        )


class BulkCreateProductAliasView(CreateAPIView):
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BulkCreateProductAliasSerializer

    def post(self, request, *args, **kwargs):
        if len(request.data) == 0:
            raise RawDataIsEmptyArray
        serializer = BulkCreateProductAliasSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer_data = serializer.initial_data
        organization = request.headers.get("organization")
        sku_list = []
        upc_list = []
        product_sku_list = []
        retailer_merchant_id_list = []
        warehouse_names = []
        merchant_sku = []
        for product_alias_item in serializer_data:
            product_sku_list.append(product_alias_item["product_sku"])
            retailer_merchant_id_list.append(product_alias_item["retailer_merchant_id"])
            sku_list.append(product_alias_item["sku"])
            upc_list.append(product_alias_item["upc"])
            merchant_sku.append(product_alias_item["merchant_sku"])
            for warehouse in product_alias_item["warehouse_array"]:
                warehouse_names.append(warehouse["warehouse_name"])

        retailer_suggestion_list = RetailerSuggestion.objects.filter(
            merchant_id__in=retailer_merchant_id_list
        )
        warehouse_names = set(warehouse_names)
        warehouse = RetailerWarehouse.objects.filter(
            name__in=warehouse_names, organization_id=organization
        )
        retailer_suggestion_object = {
            retailer_suggestion.merchant_id: retailer_suggestion
            for retailer_suggestion in retailer_suggestion_list
        }
        warehouse_name_object = {
            warehouse_item.name: warehouse_item for warehouse_item in warehouse
        }

        product_list = Product.objects.filter(
            sku__in=product_sku_list, product_series__organization_id=organization
        )
        retailer_list = Retailer.objects.filter(
            merchant_id__in=retailer_merchant_id_list, organization_id=organization
        )
        sku_object = {product_item.sku: product_item for product_item in product_list}
        merchant_id_object = {
            retailer_item.merchant_id: retailer_item for retailer_item in retailer_list
        }
        product_alias_check = ProductAlias.objects.filter(
            sku__in=sku_list, retailer__in=retailer_list
        )
        product_alias_upc_check = ProductAlias.objects.filter(
            upc__in=upc_list, retailer__in=retailer_list
        )
        if product_alias_check:
            raise ProductAliasAlreadyExists
        if product_alias_upc_check:
            raise UPCAlreadyExists
        product_alias = []
        for product_alias_item in serializer_data:
            if product_alias_item["product_sku"] not in sku_object:
                raise ProductNotFound
            if product_alias_item["retailer_merchant_id"] not in merchant_id_object:
                raise RetailerNotFound
            if product_alias_item["retailer_merchant_id"] in retailer_suggestion_object:
                if (
                    retailer_suggestion_object[
                        product_alias_item["retailer_merchant_id"]
                    ].merchant_sku_min_length
                    and len(str(product_alias_item["merchant_sku"]))
                    < retailer_suggestion_object[
                        product_alias_item["retailer_merchant_id"]
                    ].merchant_sku_min_length
                ):
                    raise ImportMerchantSKUException
                if (
                    retailer_suggestion_object[
                        product_alias_item["retailer_merchant_id"]
                    ].merchant_sku_max_length
                    and len(str(product_alias_item["merchant_sku"]))
                    > retailer_suggestion_object[
                        product_alias_item["retailer_merchant_id"]
                    ].merchant_sku_max_length
                ):
                    raise ImportMerchantSKUException

                is_valid = False
                for prefix in retailer_suggestion_object[
                    product_alias_item["retailer_merchant_id"]
                ].merchant_sku_prefix:
                    if str(product_alias_item["merchant_sku"]).startswith(
                        str(prefix.lower())
                    ):
                        is_valid = True
                        break

                if not is_valid:
                    raise ImportMerchantSKUException

            product_alias.append(
                ProductAlias(
                    sku=product_alias_item["sku"],
                    merchant_sku=product_alias_item["merchant_sku"],
                    vendor_sku=product_alias_item["vendor_sku"],
                    upc=product_alias_item["upc"],
                    sku_quantity=product_alias_item["sku_quantity"],
                    product=sku_object[product_alias_item["product_sku"]],
                    retailer=merchant_id_object[
                        product_alias_item["retailer_merchant_id"]
                    ],
                ),
            )

        product_alias = ProductAlias.objects.bulk_create(product_alias)

        # task:  send product alias upload commercehub
        product_alias_ids = [
            product_alias_item.id for product_alias_item in product_alias
        ]
        product_alias_ids = ",".join(map(str, product_alias_ids))
        # Create data for sending to SQS
        dict_data = {
            "retailer_id": product_alias[0].retailer.id,
            "product_alias_ids": product_alias_ids,
        }
        data_send_sqs = [dict_data]

        product_alias_sku_object = {
            product_alias_item.sku: product_alias_item
            for product_alias_item in product_alias
        }

        retailer_warehouse_product_list = []
        for product_alias_item in serializer_data:
            product_alias = product_alias_sku_object[product_alias_item["sku"]]
            if product_alias_item["warehouse_array"]:
                for warehouse_item in product_alias_item["warehouse_array"]:
                    if warehouse_item["warehouse_name"] not in warehouse_name_object:
                        raise WarehouseNotFound
                    retailer_warehouse_product_list.append(
                        RetailerWarehouseProduct(
                            product_alias=product_alias,
                            retailer_warehouse=warehouse_name_object[
                                warehouse_item["warehouse_name"]
                            ],
                        )
                    )
        retailer_warehouse_product = RetailerWarehouseProduct.objects.bulk_create(
            retailer_warehouse_product_list
        )
        count = 0
        product_warehouse_static_list = []
        for product_alias_item in serializer_data:
            if product_alias_item["warehouse_array"]:
                for warehouse_item in product_alias_item["warehouse_array"]:
                    product_warehouse_static_list.append(
                        ProductWarehouseStaticData(
                            qty_on_hand=warehouse_item["qty_on_hand"],
                            next_available_qty=warehouse_item["next_available_qty"],
                            next_available_date=warehouse_item["next_available_day"],
                            product_warehouse=retailer_warehouse_product[count],
                        )
                    )
                    count += 1
        ProductWarehouseStaticData.objects.bulk_create(product_warehouse_static_list)
        # send data to SQS
        message_body = json.dumps(data_send_sqs)
        sqs_client.create_queue(
            message_body=message_body,
            queue_name=settings.SQS_UPDATE_INVENTORY_TO_COMMERCEHUB_SQS_NAME,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BulkUpdateProductAliasView(
    BulkUpdateAPIView, BulkCreateProductAliasView, BulkDeleteProductAliasView
):
    queryset = ProductAlias.objects.all()
    serializer_class = BulkUpdateProductAliasSerializer

    def get_serializer(self, *args, **kwargs):
        if self.request.method in ["PUT", "PATCH"]:
            return super(BulkUpdateAPIView, self).get_serializer(
                self.get_queryset(*args, **kwargs),
                data=self.request.data,
                partial=kwargs.pop("partial", False),
                many=True,
            )
        return BulkCreateProductAliasSerializer(data=self.request.data, many=True)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BulkCreateProductAliasSerializer
        return BulkUpdateProductAliasSerializer

    def perform_update(self, serializer):
        serializer.save()
        retailer_ids = [str(instance.retailer_id) for instance in serializer.instance]
        sqs_client.create_queue(
            message_body=",".join(retailer_ids),
            queue_name=settings.SQS_UPDATE_RETAILER_INVENTORY_SQS_NAME,
        )


class ProductAliasInventoryXMLView(CreateAPIView):
    serializer_class = ProductAliasInventorySerializer

    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        ids = validated_data.get("product_alias_ids")
        list_id = ids.split(",")
        list_product_alias = ProductAlias.objects.filter(id__in=list_id)
        product_alias = {}
        for product_alias_item in list_product_alias:
            retailer_id = product_alias_item.retailer.id
            if retailer_id not in product_alias:
                product_alias[retailer_id] = []
            product_alias[retailer_id].append(product_alias_item.id)
        data_send_sqs = []
        for key, value in product_alias.items():
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
        return Response(message_body)
