from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.role_user.models import RoleUser
from selleraxis.role_user.serializers import ReadRoleUserSerializer, RoleUserSerializer


class ListCreateRoleUserView(ListCreateAPIView):
    model = RoleUser
    serializer_class = RoleUserSerializer
    queryset = RoleUser.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at"]
    search_fields = ["name"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRoleUserSerializer
        else:
            return RoleUserSerializer

    def get_queryset(self):
        return self.queryset.filter(
            role__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_MEMBER)
            case _:
                return check_permission(self, Permissions.INVITE_MEMBER)


class UpdateDeleteRoleUserView(RetrieveUpdateDestroyAPIView):
    model = RoleUser
    serializer_class = RoleUserSerializer
    lookup_field = "id"
    queryset = RoleUser.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            role__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_MEMBER)
            case "DELETE":
                return check_permission(self, Permissions.REMOVE_MEMBER)
            case _:
                return check_permission(self, Permissions.UPDATE_MEMBER_ROLE)
