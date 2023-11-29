from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import DestroyAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.permissions import check_permission
from selleraxis.core.views import BaseGenericAPIView, BaseListCreateAPIView
from selleraxis.permissions.models import Permissions

from .models import ProductSeries
from .serializers import ProductSeriesSerializer, ReadProductSeriesSerializer


class ListCreateProductSeriesView(BaseListCreateAPIView):
    serializer_class = ProductSeriesSerializer
    queryset = ProductSeries.objects.all()
    search_fields = ["series"]
    ordering_fields = ["id", "created_at"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductSeriesSerializer
        return ProductSeriesSerializer

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.headers.get("organization"))

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        ).prefetch_related("package_rules__box", "products")

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_SERIES)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT_SERIES)


class UpdateDeleteProductSeriesView(BaseGenericAPIView, RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSeriesSerializer
    queryset = ProductSeries.objects.all()

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductSeriesSerializer
        return ProductSeriesSerializer

    def get_queryset(self):
        if self.request.method == "GET":
            return self.queryset.filter(
                organization_id=self.request.headers.get("organization")
            ).prefetch_related("package_rules__box", "products")
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_SERIES)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT_SERIES)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT_SERIES)


class BulkProductSeriesView(DestroyAPIView):
    model = ProductSeries
    lookup_field = "id"
    queryset = ProductSeries.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        return check_permission(self, Permissions.DELETE_PRODUCT_SERIES)

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
        ProductSeries.objects.filter(
            id__in=ids.split(","), organization=organization_id
        ).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
