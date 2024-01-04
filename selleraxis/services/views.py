from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.services.models import Services
from selleraxis.services.serializers import ServicesSerializer


class ListServiceView(ListAPIView):
    model = Services
    serializer_class = ServicesSerializer
    queryset = Services.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    filterset_fields = ["is_active"]
    ordering_fields = ["created_at"]
    search_fields = ["name"]

    def get_queryset(self):
        queryset = self.queryset
        is_active_param = self.request.query_params.get("is_active", None)
        if is_active_param is None:
            queryset = queryset.filter(is_active=True)
        return queryset

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_SERVICE)
            case _:
                return check_permission(self, Permissions.CREATE_SERVICE)
