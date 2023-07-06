from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.product_alias.serializers import ProductAliasSerializer


class ListCreateProductAliasView(ListCreateAPIView):
    model: ProductAlias
    serializer_class = ProductAliasSerializer
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at", "product", "retailer"]
    search_fields = ["sku", "product", "retailer"]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_ALIAS)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT_ALIAS)


class UpdateDeleteProductAliasView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductAliasSerializer
    lookup_field = "id"
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_ALIAS)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT_ALIAS)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT_ALIAS)
