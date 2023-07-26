from django.http import JsonResponse
from rest_framework import status
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.order_package.models import OrderPackage
from selleraxis.order_package.serializers import (
    OrderPackageSerializer,
    ReadOrderPackageSerializer,
)
from selleraxis.order_package.services import delete_order_package_service
from selleraxis.permissions.models import Permissions


class ListCreateOrderPackageView(ListCreateAPIView):
    model = OrderPackage
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
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_ORDER_PACKAGE)
            case _:
                return check_permission(self, Permissions.CREATE_ORDER_PACKAGE)


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
