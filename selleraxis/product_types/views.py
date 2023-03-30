from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.product_types.models import ProductType
from selleraxis.product_types.serializers import ProductTypeSerializer


class ListCreateProductTypeView(ListCreateAPIView):
    model = ProductType
    serializer_class = ProductTypeSerializer
    queryset = ProductType.objects.all()
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
                return check_permission(self, Permissions.READ_PRODUCT_TYPE)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT_TYPE)


class UpdateDeleteProductTypeView(RetrieveUpdateDestroyAPIView):
    model = ProductType
    serializer_class = ProductTypeSerializer
    lookup_field = "id"
    queryset = ProductType.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_TYPE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT_TYPE)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT_TYPE)
