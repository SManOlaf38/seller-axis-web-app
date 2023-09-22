from django.conf import settings
from django.db.models import OuterRef, Subquery
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    CreateAPIView,
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
    ImportMerchantSKUException,
    ProductAliasAlreadyExists,
    ProductNotFound,
    RetailerNotFound,
    WarehouseNotFound,
)
from selleraxis.product_alias.models import ProductAlias
from selleraxis.product_alias.serializers import (
    BulkCreateProductAliasSerializer,
    BulkUpdateProductAliasSerializer,
    ProductAliasSerializer,
    ReadProductAliasSerializer,
)
from selleraxis.product_warehouse_static_data.models import ProductWarehouseStaticData
from selleraxis.products.models import Product
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
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["product", "retailer", "created_at"]
    search_fields = ["merchant_sku", "retailer__name"]

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

    def perform_create(self, serializer):
        serializer.save()
        retailer_ids = [str(serializer.instance.retailer_id)]
        sqs_client.create_queue(
            message_body=",".join(retailer_ids),
            queue_name=settings.SQS_UPDATE_RETAILER_INVENTORY_SQS_NAME,
        )
        return serializer


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


class BulkCreateProductAliasView(CreateAPIView):
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = BulkCreateProductAliasSerializer

    def post(self, request, *args, **kwargs):
        serializer = BulkCreateProductAliasSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer_data = serializer.initial_data
        organization = request.headers.get("organization")
        sku_list = []
        product_sku_list = []
        retailer_merchant_id_list = []
        warehouse_names = []
        merchant_sku = []
        for product_alias_item in serializer_data:
            product_sku_list.append(product_alias_item["product_sku"])
            retailer_merchant_id_list.append(product_alias_item["retailer_merchant_id"])
            sku_list.append(product_alias_item["sku"])
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
        if product_alias_check:
            raise ProductAliasAlreadyExists
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
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BulkUpdateProductAliasView(BulkUpdateAPIView, BulkCreateProductAliasView):
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
