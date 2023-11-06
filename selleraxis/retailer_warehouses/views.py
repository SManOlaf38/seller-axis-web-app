from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    DestroyAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_warehouses.models import RetailerWarehouse
from selleraxis.retailer_warehouses.serializers import (
    ReadRetailerWarehouseSerializer,
    RetailerWarehouseAliasSerializer,
)


class ListCreateRetailerWarehouseView(ListCreateAPIView):
    model: RetailerWarehouse
    serializer_class = RetailerWarehouseAliasSerializer
    queryset = RetailerWarehouse.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at"]
    search_fields = ["name"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerWarehouseSerializer
        return RetailerWarehouseAliasSerializer

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def perform_create(self, serializer):
        return serializer.save(organization_id=self.request.headers.get("organization"))

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_WAREHOUSE)
            case _:
                return check_permission(self, Permissions.CREATE_RETAILER_WAREHOUSE)


class UpdateDeleteRetailerWarehouseView(RetrieveUpdateDestroyAPIView):
    serializer_class = RetailerWarehouseAliasSerializer
    lookup_field = "id"
    queryset = RetailerWarehouse.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(organization_id=organization_id)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerWarehouseSerializer
        return RetailerWarehouseAliasSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_WAREHOUSE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_RETAILER_WAREHOUSE)
            case _:
                return check_permission(self, Permissions.UPDATE_RETAILER_WAREHOUSE)


class BulkRetailerWarehouseView(DestroyAPIView):
    model = RetailerWarehouse
    lookup_field = "id"
    queryset = RetailerWarehouse.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        return check_permission(self, Permissions.DELETE_RETAILER_WAREHOUSE)

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
        organization_id = self.request.headers.get("organization")
        ids = request.query_params.get("ids")
        RetailerWarehouse.objects.filter(
            id__in=ids.split(","), organization=organization_id
        ).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
