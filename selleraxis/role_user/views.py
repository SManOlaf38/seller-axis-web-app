from rest_framework.exceptions import ParseError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.role_user.models import RoleUser
from selleraxis.role_user.serializers import (
    CreateRoleUserSerializer,
    ReadRoleUserSerializer,
    UpdateRoleUserSerializer,
)
from selleraxis.roles.models import Role
from selleraxis.users.models import User


class ListCreateRoleUserView(ListCreateAPIView):
    model = RoleUser
    serializer_class = ReadRoleUserSerializer
    queryset = RoleUser.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at"]
    search_fields = ["user__first_name", "user__last_name", "user__email"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRoleUserSerializer
        return CreateRoleUserSerializer

    def get_queryset(self):
        return self.queryset.filter(role__organization_id=self.kwargs["org_id"])

    def perform_create(self, serializer):
        email = serializer.validated_data.get("email")
        role_id = serializer.validated_data.get("role")
        user = User.objects.filter(email=email).first()
        if not user:
            raise ParseError("User available with email not exist!")
        role = Role.objects.filter(id=role_id).first()
        if not role:
            raise ParseError("Role must is in organization!")
        new_member = RoleUser(
            user=user,
            role=role,
        )
        new_member.save()
        return new_member

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_MEMBER)
            case _:
                return check_permission(self, Permissions.INVITE_MEMBER)


class UpdateDeleteRoleUserView(RetrieveUpdateDestroyAPIView):
    model = RoleUser
    serializer_class = ReadRoleUserSerializer
    lookup_field = "id"
    queryset = RoleUser.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "PUT":
            return UpdateRoleUserSerializer
        return ReadRoleUserSerializer

    def get_queryset(self):
        return self.queryset.filter(role__organization_id=self.kwargs["org_id"])

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_MEMBER)
            case "DELETE":
                return check_permission(self, Permissions.REMOVE_MEMBER)
            case _:
                return check_permission(self, Permissions.UPDATE_MEMBER)
