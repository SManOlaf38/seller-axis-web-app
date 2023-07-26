from django.http import JsonResponse
from rest_framework import status
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
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

    def perform_create(self, serializer):
        return serializer.save()

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_ORDER_ITEM_PACKAGE)
            case _:
                return check_permission(self, Permissions.CREATE_ORDER_ITEM_PACKAGE)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            response = create_order_item_package_service(
                package=serializer.validated_data.get("package"),
                order_item=serializer.validated_data.get("order_item"),
                quantity=serializer.validated_data.get("quantity"),
            )
            return JsonResponse(
                {"message": "Successful!", "data": response},
                status=status.HTTP_200_OK,
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
            return JsonResponse(
                {"message": "Successful!", "data": response},
                status=status.HTTP_200_OK,
            )
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
