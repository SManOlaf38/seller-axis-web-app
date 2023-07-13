from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.product_alias.serializers import (
    ProductAliasSerializer,
    ReadProductAliasSerializer,
)


class ListCreateProductAliasView(ListCreateAPIView):
    model = ProductAlias
    serializer_class = ProductAliasSerializer
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["product", "retailer"]
    search_fields = ["sku", "product__sku", "retailer__name"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductAliasSerializer
        return ProductAliasSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_ALIAS)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT_ALIAS)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(product__organization_id=organization_id)


class UpdateDeleteProductAliasView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductAliasSerializer
    lookup_field = "id"
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductAliasSerializer
        return ProductAliasSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_ALIAS)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT_ALIAS)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT_ALIAS)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(product__organization_id=organization_id)
