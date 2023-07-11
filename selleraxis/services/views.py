from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.services.models import Services
from selleraxis.services.serializers import ServicesSerializer


class ListCreateServiceView(ListCreateAPIView):
    model = Services
    serializer_class = ServicesSerializer
    queryset = Services.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at"]
    search_fields = ["name"]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_SERVICE)
            case _:
                return check_permission(self, Permissions.CREATE_SERVICE)


class UpdateDeleteServiceView(RetrieveUpdateDestroyAPIView):
    model = Services
    serializer_class = ServicesSerializer
    lookup_field = "id"
    queryset = Services.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_SERVICE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_SERVICE)
            case _:
                return check_permission(self, Permissions.UPDATE_SERVICE)
