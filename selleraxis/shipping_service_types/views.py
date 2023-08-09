from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.shipping_service_types.models import ShippingServiceType
from selleraxis.shipping_service_types.serializers import (
    ShippingServiceTypeSerializerShow,
)


class ListShippingServiceTypeView(ListAPIView):
    model = ShippingServiceType
    serializer_class = ShippingServiceTypeSerializerShow
    queryset = ShippingServiceType.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at"]
    search_fields = ["name", "service__name"]

    def check_permissions(self, _):
        return check_permission(self, Permissions.READ_SERVICE)
