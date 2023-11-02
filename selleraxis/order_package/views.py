from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.boxes.models import Box
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.exceptions import (
    BoxNotFound,
    MaxQuantytiPackageRule,
    MaxQuantytiPoItem,
    PackageRuleNotFound,
    ProductAliasNotFound,
)
from selleraxis.order_package.models import OrderPackage
from selleraxis.order_package.serializers import (
    AddPackageSerializer,
    BulkCreateOrderPackageSerializer,
    BulkUpdateOrderPackageSerializer,
    OrderPackageSerializer,
    ReadOrderPackageSerializer,
)
from selleraxis.order_package.services import (
    create_order_package_service,
    delete_order_package_service,
)
from selleraxis.package_rules.models import PackageRule
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder


class ListCreateOrderPackageView(ListCreateAPIView):
    serializer_class = OrderPackageSerializer
    queryset = OrderPackage.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at"]
    search_fields = ["order__id"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadOrderPackageSerializer
        if self.request.method == "POST":
            return AddPackageSerializer
        return OrderPackageSerializer

    def check_permissions(self, _):
        return check_permission(self, Permissions.READ_ORDER_PACKAGE)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "is_check",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            ),
            # ... add more parameters as needed ...
        ]
    )
    def post(self, request, *args, **kwargs):
        serializer = AddPackageSerializer(data=request.data)
        is_check = request.query_params.get("is_check")
        if serializer.is_valid():
            response = create_order_package_service(
                order_item_id=serializer.validated_data.get("order_item"),
                box_id=serializer.validated_data.get("box"),
                quantity=serializer.validated_data.get("quantity"),
                is_check=is_check,
            )
            if response.get("status") == 200:
                return Response(
                    data={"data": response.get("message")}, status=status.HTTP_200_OK
                )
            elif response.get("status") == 400:
                return Response(
                    data={"data": response.get("message")},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateDeleteOrderPackageView(RetrieveUpdateDestroyAPIView):
    model = OrderPackage
    serializer_class = OrderPackageSerializer
    lookup_field = "id"
    queryset = OrderPackage.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadOrderPackageSerializer
        return OrderPackageSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_ORDER_PACKAGE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_ORDER_PACKAGE)
            case _:
                return check_permission(self, Permissions.UPDATE_ORDER_PACKAGE)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(
            box__organization_id=organization_id
        ).select_related("order__batch")

    def delete(self, request, *args, **kwargs):
        response = delete_order_package_service(
            order_id_package=self.kwargs.get("id"),
        )
        return Response(data={"data": response}, status=status.HTTP_200_OK)


class BulkOrderPackage(GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = OrderPackage.objects.all()
    serializer_class = BulkUpdateOrderPackageSerializer

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BulkCreateOrderPackageSerializer
        return BulkUpdateOrderPackageSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "purchase_order_id",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        po_id = request.query_params.get("purchase_order_id")
        po = RetailerPurchaseOrder.objects.filter(id=po_id).first()
        data = request.data
        po_item_ids = []
        quantity = 0
        for item in data["items"]:
            po_item_ids.append(item["order_item"])
            quantity += item["quantity"]

        # Check if there is a box or not
        box_id = data["box"]
        box = Box.objects.filter(id=box_id).first()
        if not box:
            raise BoxNotFound

        # check whether product_alias, package_rule exists or not
        order_item_list = RetailerPurchaseOrderItem.objects.filter(id__in=po_item_ids)
        merchant_sku = [order_item.merchant_sku for order_item in order_item_list]
        list_product_alias = ProductAlias.objects.filter(
            merchant_sku__in=merchant_sku,
            retailer_id=po.batch.retailer_id,
        )
        if len(list_product_alias) == 0:
            raise ProductAliasNotFound
        product_series_ids = [
            product_alias.product.product_series.id
            for product_alias in list_product_alias
        ]
        package_rule = PackageRule.objects.filter(
            product_series_id__in=product_series_ids, box_id=box_id
        )
        if len(package_rule) > 1 or len(package_rule) == 0:
            raise PackageRuleNotFound

        # Check the quantity is correct or not
        if quantity > package_rule[0].max_quantity:
            raise MaxQuantytiPackageRule
        for item in data["items"]:
            for po_item in order_item_list:
                if (
                    item["order_item"] == po_item.id
                    and item["quantity"] > po_item.qty_ordered
                ):
                    raise MaxQuantytiPoItem

        # Calculate the weight of the box
        list_object = []
        for item in data["items"]:
            for po_item in order_item_list:
                if item["order_item"] == po_item.id:
                    object_merchant_sku = {
                        "merchant_sku": po_item.merchant_sku,
                        "qty": item["quantity"],
                    }
                    list_object.append(object_merchant_sku)
        weight = 0
        weight_unit = "LB"
        for object in list_object:
            for product_alias_item in list_product_alias:
                if object["merchant_sku"] == product_alias_item.merchant_sku:
                    weight += object["qty"] * product_alias_item.product.weight
                    weight_unit = product_alias_item.product.weight_unit

        # create order_package
        order_package = OrderPackage(
            box_id=box_id,
            order_id=po_id,
            length=box.length,
            width=box.width,
            height=box.height,
            dimension_unit=box.dimension_unit,
            weight=weight,
            weight_unit=weight_unit,
        )
        order_package.save()

        # create order_item_package
        order_item_package_list = []
        for item in data["items"]:
            order_item_package_list.append(
                OrderItemPackage(
                    quantity=item["quantity"],
                    package_id=order_package.id,
                    order_item_id=item["order_item"],
                )
            )
        OrderItemPackage.objects.bulk_create(order_item_package_list)
        serializer = OrderPackageSerializer(order_package)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
            list_order_package_to_delete = OrderPackage.objects.filter(
                id__in=list_id, box__organization_id=organization_id
            )
            list_order_package_shipped = list_order_package_to_delete.filter(
                shipment_packages__isnull=False
            )
            if (
                list_order_package_shipped is not None
                and len(list_order_package_shipped) > 0
            ):
                list_box_name = [
                    order_package.box.name
                    for order_package in list_order_package_shipped
                ]
                raise ParseError(f"Shipped can't be deleted {', '.join(list_box_name)}")
            else:
                list_order_package_to_delete.delete()
        return Response(
            data={"data": "Order Packages deleted successfully"},
            status=status.HTTP_200_OK,
        )

    def put(self, request, *args, **kwargs):
        data = request.data
        obj_to_be_update = []
        ids = [i["id"] for i in data]
        order_package_list = OrderPackage.objects.filter(id__in=ids)
        for order_package in order_package_list:
            for item in data:
                if order_package.id == item["id"]:
                    order_package.length = item["length"]
                    order_package.width = item["width"]
                    order_package.height = item["height"]
                    order_package.dimension_unit = item["dimension_unit"]
                    order_package.weight = item["weight"]
                    order_package.weight_unit = item["weight_unit"]
                    obj_to_be_update.append(order_package)

        OrderPackage.objects.bulk_update(
            obj_to_be_update,
            ["length", "width", "height", "dimension_unit", "weight", "weight_unit"],
        )
        return Response(status=status.HTTP_200_OK)
