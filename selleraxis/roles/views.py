from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.roles.models import Role
from selleraxis.roles.serializers import RoleSerializer


class ListCreateRoleView(ListCreateAPIView):
    model = Role
    serializer_class = RoleSerializer
    queryset = Role.objects.all()
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
                return check_permission(self, Permissions.READ_ROLE)
            case _:
                return check_permission(self, Permissions.CREATE_ROLE)


class UpdateDeleteRoleView(RetrieveUpdateDestroyAPIView):
    model = Role
    serializer_class = RoleSerializer
    lookup_field = "id"
    queryset = Role.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_ROLE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_ROLE)
            case _:
                return check_permission(self, Permissions.UPDATE_ROLE)
