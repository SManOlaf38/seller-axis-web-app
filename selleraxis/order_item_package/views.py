from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.core.utils.convert_weight_by_unit import convert_weight
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_item_package.serializers import (
    OrderItemPackageSerializer,
    ReadOrderItemPackageSerializer,
    UpdateOrderItemPackageSerializer,
)
from selleraxis.order_item_package.services import (
    create_order_item_package_service,
    update_order_item_package_service,
)
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias


class ListCreateOrderItemPackageView(ListCreateAPIView):
    model = OrderItemPackage
    serializer_class = OrderItemPackageSerializer
    queryset = OrderItemPackage.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter]
    ordering_fields = ["created_at"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadOrderItemPackageSerializer
        return OrderItemPackageSerializer

    def get_queryset(self):
        return self.queryset.select_related(
            "package", "order_item__order__batch__retailer__organization"
        )

    def perform_create(self, serializer):
        return serializer.save()

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_ORDER_ITEM_PACKAGE)
            case _:
                return check_permission(self, Permissions.CREATE_ORDER_ITEM_PACKAGE)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            response = create_order_item_package_service(
                package=serializer.validated_data.get("package"),
                order_item=serializer.validated_data.get("order_item"),
                quantity=serializer.validated_data.get("quantity"),
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


class UpdateDeleteOrderItemPackageView(RetrieveUpdateDestroyAPIView):
    model = OrderItemPackage
    serializer_class = OrderItemPackageSerializer
    lookup_field = "id"
    queryset = OrderItemPackage.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadOrderItemPackageSerializer
        elif self.request.method in ["PUT", "PATH"]:
            return UpdateOrderItemPackageSerializer
        return OrderItemPackageSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_ORDER_ITEM_PACKAGE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_ORDER_ITEM_PACKAGE)
            case _:
                return check_permission(self, Permissions.UPDATE_ORDER_ITEM_PACKAGE)

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            response = update_order_item_package_service(
                order_item_package_id=self.kwargs.get("id"),
                quantity=serializer.validated_data.get("quantity"),
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

    def delete(self, request, *args, **kwargs):
        delete_id = kwargs.get("id")
        delete_order_item = self.queryset.filter(
            id=delete_id, package__shipment_packages__isnull=True
        ).first()
        if delete_order_item is not None:
            order_package = delete_order_item.package
            order_item = delete_order_item.order_item
            list_product_alias = ProductAlias.objects.filter(
                merchant_sku=order_item.merchant_sku,
                retailer__id=order_item.order.batch.retailer.id,
            )
            if len(list_product_alias) > 1:
                raise ParseError("Some product alias duplicate merchant_sku")
            if len(list_product_alias) == 0:
                raise ParseError("Not found valid product alias")
            product_alias = list_product_alias[0]
            if len(order_package.order_item_packages.all()) == 1:
                order_package.weight = 0
            else:
                # re-calculating weight of box
                subtract_weight = (
                    delete_order_item.quantity
                    * product_alias.product.weight
                    * product_alias.sku_quantity
                )
                item_weight_unit = product_alias.product.weight_unit.upper()
                if item_weight_unit not in ["LB", "LBS"]:
                    subtract_weight = convert_weight(
                        weight_value=subtract_weight, weight_unit=item_weight_unit
                    )
                old_package_weight = convert_weight(
                    weight_value=order_package.weight,
                    weight_unit=order_package.weight_unit.upper(),
                )
                order_package.weight_unit = "lbs"
                order_package.weight = old_package_weight - subtract_weight
            order_package.save()

            delete_order_item.delete()
        else:
            raise ParseError("Package contain this item is shipped or non exist")

        return Response(status=status.HTTP_204_NO_CONTENT)
