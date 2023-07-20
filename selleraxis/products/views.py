from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.products.models import Product
from selleraxis.products.serializers import ProductSerializer, ReadProductSerializer


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

    def perform_create(self, serializer):
        serializer.save()

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
