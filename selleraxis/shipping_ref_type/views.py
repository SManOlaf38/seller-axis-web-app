from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.shipping_ref_type.models import ShippingRefType
from selleraxis.shipping_ref_type.serializers import ShippingRefTypeSerializer


class ListCreateShippingRefTypeView(ListCreateAPIView):
    model = ShippingRefType
    serializer_class = ShippingRefTypeSerializer
    queryset = ShippingRefType.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at"]
    search_fields = ["name"]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_SERVICE_TYPE)
            case _:
                return check_permission(self, Permissions.CREATE_SERVICE_TYPE)


class UpdateDeleteShippingRefTypeView(RetrieveUpdateDestroyAPIView):
    serializer_class = ShippingRefTypeSerializer
    lookup_field = "id"
    queryset = ShippingRefType.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_SERVICE_TYPE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_SERVICE_TYPE)
            case _:
                return check_permission(self, Permissions.UPDATE_SERVICE_TYPE)
