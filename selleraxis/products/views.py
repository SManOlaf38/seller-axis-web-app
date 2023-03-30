from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.products.models import Product
from selleraxis.products.serializers import ProductSerializer, ReadProductSerializer


class ListCreateProductView(ListCreateAPIView):
    model = Product
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["title", "child_sku", "master_sku", "created_at"]
    search_fields = ["title", "child_sku", "master_sku"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductSerializer
        else:
            return ProductSerializer

    def perform_create(self, serializer):
        return serializer.save(organization_id=self.request.headers.get("organization"))

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PACKAGE_RULE)
            case _:
                return check_permission(self, Permissions.CREATE_PACKAGE_RULE)


class UpdateDeleteProductView(RetrieveUpdateDestroyAPIView):
    model = Product
    serializer_class = ProductSerializer
    lookup_field = "id"
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductSerializer
        else:
            return ProductSerializer

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PACKAGE_RULE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PACKAGE_RULE)
            case _:
                return check_permission(self, Permissions.UPDATE_PACKAGE_RULE)
