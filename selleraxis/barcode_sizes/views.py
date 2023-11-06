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

from selleraxis.barcode_sizes.models import BarcodeSize
from selleraxis.barcode_sizes.serializers import BarcodeSizeSerializer
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions


class ListCreateBarcodeSizeView(ListCreateAPIView):
    model = BarcodeSize
    serializer_class = BarcodeSizeSerializer
    queryset = BarcodeSize.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["name", "created_at"]
    search_fields = ["name"]

    def perform_create(self, serializer):
        return serializer.save(organization_id=self.request.headers.get("organization"))

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_BARCODE_SIZE)
            case _:
                return check_permission(self, Permissions.CREATE_BARCODE_SIZE)


class UpdateDeleteBarcodeSizeView(RetrieveUpdateDestroyAPIView):
    model = BarcodeSize
    serializer_class = BarcodeSizeSerializer
    lookup_field = "id"
    queryset = BarcodeSize.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_BARCODE_SIZE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_BARCODE_SIZE)
            case _:
                return check_permission(self, Permissions.UPDATE_BARCODE_SIZE)


class BulkBarcodeSizeView(DestroyAPIView):
    model = BarcodeSize
    lookup_field = "id"
    queryset = BarcodeSize.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        return check_permission(self, Permissions.DELETE_BARCODE_SIZE)

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
        BarcodeSize.objects.filter(
            id__in=ids.split(","), organization=organization_id
        ).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
