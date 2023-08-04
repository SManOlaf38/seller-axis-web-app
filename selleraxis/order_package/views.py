from rest_framework import status
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.core.views import BulkUpdateAPIView
from selleraxis.order_package.models import OrderPackage
from selleraxis.order_package.serializers import (
    AddPackageSerializer,
    BulkUpdateOrderPackageSerializer,
    OrderPackageSerializer,
    ReadOrderPackageSerializer,
)
from selleraxis.order_package.services import (
    create_order_package_service,
    delete_order_package_service,
)
from selleraxis.permissions.models import Permissions


class ListCreateOrderPackageView(ListCreateAPIView):
    serializer_class = OrderPackageSerializer
    queryset = OrderPackage.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter]
    ordering_fields = ["created_at"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadOrderPackageSerializer
        if self.request.method == "POST":
            return AddPackageSerializer
        return OrderPackageSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def check_permissions(self, _):
        return check_permission(self, Permissions.READ_ORDER_PACKAGE)

    def post(self, request, *args, **kwargs):
        serializer = AddPackageSerializer(data=request.data)
        if serializer.is_valid():
            response = create_order_package_service(
                order_item_id=serializer.validated_data.get("order_item"),
                box_id=serializer.validated_data.get("box"),
                quantity=serializer.validated_data.get("quantity")
            )
            if response.get("status") == 200:
                return Response(data={"data": response.get("message")}, status=status.HTTP_200_OK)
            elif response.get("status") == 400:
                return Response(data={"data": response.get("message")}, status=status.HTTP_400_BAD_REQUEST)
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


class BulkUpdateOrderPackageView(BulkUpdateAPIView):
    queryset = OrderPackage.objects.all()
    serializer_class = BulkUpdateOrderPackageSerializer
