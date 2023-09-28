from django.conf import settings
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.products.models import Product
from selleraxis.products.serializers import (
    CreateQuickbookProductSerializer,
    ProductSerializer,
    ReadProductSerializer,
)
from selleraxis.products.services import (
    create_quickbook_product_service,
    update_quickbook_product_service,
)


class ListCreateProductView(ListCreateAPIView):
    model: Product
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at", "sku"]
    search_fields = ["sku"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductSerializer
        return ProductSerializer

    def get_queryset(self):
        return self.queryset.filter(
            product_series__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT)


class UpdateDeleteProductView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    lookup_field = "id"
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductSerializer
        return ProductSerializer

    def get_queryset(self):
        return self.queryset.filter(
            product_series__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT)


class BulkDeleteProductView(GenericAPIView):
    permission_classes = [IsAuthenticated]

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
            Product.objects.filter(
                id__in=list_id, product_series__organization_id=organization_id
            ).delete()
        return Response(
            data={"data": "Products deleted successfully"},
            status=status.HTTP_200_OK,
        )


class QuickbookCreateProduct(GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        secrets = self.request.headers.get("Authorization")
        if secrets != settings.LAMBDA_SECRET_KEY:
            return Response(
                data={"data": "Miss LAMBDA_SECRET_KEY"}, status=status.HTTP_401_UNAUTHORIZED
            )
        serializer = CreateQuickbookProductSerializer(data=request.data)
        if serializer.is_valid():
            response = create_quickbook_product_service(
                action=serializer.validated_data.get("action"),
                model=serializer.validated_data.get("model"),
                object_id=serializer.validated_data.get("object_id"),
            )
            return Response(data={"data": response}, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuickbookUpdateProduct(GenericAPIView):
    permission_classes = [AllowAny]

    def patch(self, request, *args, **kwargs):
        secrets = self.request.headers.get("Authorization")
        if secrets != settings.LAMBDA_SECRET_KEY:
            return Response(
                data={"data": "Miss LAMBDA_SECRET_KEY"}, status=status.HTTP_401_UNAUTHORIZED
            )
        serializer = CreateQuickbookProductSerializer(data=request.data)
        if serializer.is_valid():
            response = update_quickbook_product_service(
                action=serializer.validated_data.get("action"),
                model=serializer.validated_data.get("model"),
                object_id=serializer.validated_data.get("object_id"),
            )
            return Response(data={"data": response}, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCreateQBOView(QuickbookCreateProduct, QuickbookUpdateProduct):
    serializer_class = CreateQuickbookProductSerializer
