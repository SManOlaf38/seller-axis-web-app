from django.http import Http404, JsonResponse
from rest_framework import status
from rest_framework.filters import OrderingFilter
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.boxes.models import Box
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.models import OrderPackage
from selleraxis.order_package.serializers import (
    AddPackageSerializer,
    OrderPackageSerializer,
    ReadOrderPackageSerializer,
)
from selleraxis.order_package.services import delete_order_package_service
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem


class ListOrderPackageView(ListAPIView):
    serializer_class = OrderPackageSerializer
    queryset = OrderPackage.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter]
    ordering_fields = ["created_at"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadOrderPackageSerializer
        return OrderPackageSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def check_permissions(self, _):
        return check_permission(self, Permissions.READ_ORDER_PACKAGE)


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
        return self.queryset.filter(box__organization_id=organization_id)

    def delete(self, request, *args, **kwargs):
        response = delete_order_package_service(
            order_id_package=self.kwargs.get("id"),
        )
        return JsonResponse(
            {"message": "Successful!", "data": response},
            status=status.HTTP_200_OK,
        )


class CreateOrderPackageView(CreateAPIView):
    serializer_class = AddPackageSerializer

    def check_permissions(self, _):
        return check_permission(self, Permissions.CREATE_ORDER_PACKAGE)

    def post(self, request):
        serializer = AddPackageSerializer(data=request.data)
        if serializer.is_valid():
            po_item_id = serializer.data.get("po_item_id")
            try:
                po_item = RetailerPurchaseOrderItem.objects.get(id=po_item_id)
            except RetailerPurchaseOrderItem.DoesNotExist:
                raise Http404
            try:
                box = Box.objects.get(id=serializer.validated_data.get("box_id"))
            except Box.DoesNotExist:
                raise Http404
            try:
                product_alias = ProductAlias.objects.get(sku=po_item.vendor_sku)
            except ProductAlias.DoesNotExist:
                raise Http404

            order_id = po_item.order.id

            order_package = OrderPackage.objects.create(
                box_id=serializer.validated_data.get("box_id"),
                order_id=order_id,
                length=box.length,
                width=box.width,
                height=box.height,
                dimension_unit=box.dimension_unit,
                weight=product_alias.product.weight * po_item.qty_ordered,
                weight_unit=product_alias.product.weight_unit,
            )
            OrderItemPackage.objects.create(
                quantity=serializer.validated_data.get("qty"),
                package_id=order_package.id,
                order_item_id=po_item_id,
            )
            return Response(
                {"message": "Successful!", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        return Response({"err": "bug"}, status=status.HTTP_400_BAD_REQUEST)
