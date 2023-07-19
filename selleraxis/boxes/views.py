from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions

from .models import Box
from .serializers import BoxSerializer


class ListCreateBoxView(ListCreateAPIView):
    model = Box
    serializer_class = BoxSerializer
    queryset = Box.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at", "name"]
    search_fields = ["name", "id"]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_BOX)
            case _:
                return check_permission(self, Permissions.CREATE_BOX)


class UpdateDeleteBoxView(RetrieveUpdateDestroyAPIView):
    model = Box
    serializer_class = BoxSerializer
    lookup_field = "id"
    queryset = Box.objects.all()
    permission_classes = [IsAuthenticated]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_BOX)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_BOX)
            case _:
                return check_permission(self, Permissions.UPDATE_BOX)
