from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.organizations.models import Organization
from selleraxis.organizations.serializers import (
    OrganizationSerializer,
    UpdateOrganizationSerializer,
)
from selleraxis.organizations.services import update_organization_service
from selleraxis.permissions.models import Permissions
from selleraxis.role_user.models import RoleUser
from selleraxis.roles.models import Role


class ListCreateOrganizationView(ListCreateAPIView):
    model = Organization
    serializer_class = OrganizationSerializer
    queryset = Organization.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["name", "created_at"]
    search_fields = ["name"]

    def perform_create(self, serializer):
        email = serializer.validated_data.get("email", None)
        sandbox_serializer = OrganizationSerializer(data=serializer.validated_data)
        sandbox_organization = None
        if sandbox_serializer.is_valid():
            sandbox_organization = sandbox_serializer.save(
                created_by=self.request.user,
                email=email if email and email != "" else self.request.user.email,
            )
        organization = serializer.save(
            sandbox_organization=sandbox_organization,
            created_by=self.request.user,
            email=email if email and email != "" else self.request.user.email,
        )

        roles = Role.objects.bulk_create(
            [
                Role(
                    name="Admin",
                    permissions=[permission.value for permission in Permissions],
                    organization=organization,
                ),
                Role(
                    name="Editor",
                    permissions=[
                        permission.value
                        for permission in Permissions
                        if permission.value
                        not in [
                            "INVITE_MEMBER",
                            "REMOVE_MEMBER",
                            "UPDATE_MEMBER_ROLE",
                            "CREATE_ROLE",
                            "UPDATE_ROLE",
                            "DELETE_ROLE",
                        ]
                    ],
                    organization=organization,
                ),
                Role(
                    name="Reader",
                    permissions=[
                        permission.value
                        for permission in Permissions
                        if "READ" in permission.value
                    ],
                    organization=organization,
                ),
            ]
        )

        RoleUser(
            user_id=self.request.user.id,
            role_id=roles[0].id,
        ).save()

        return organization

    def get_queryset(self):
        return self.queryset.filter(
            roles__members__user=self.request.user, sandbox_organization__isnull=False
        ).prefetch_related("prod_organization")


class UpdateDeleteOrganizationView(RetrieveUpdateDestroyAPIView):
    model = Organization
    serializer_class = UpdateOrganizationSerializer
    lookup_field = "id"
    queryset = Organization.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            roles__members__user=self.request.user
        ).prefetch_related("prod_organization")

    def check_permissions(self, _):
        match self.request.method:
            case "PUT" | "PATCH":
                return check_permission(self, Permissions.UPDATE_ORGANIZATION)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_ORGANIZATION)

    def perform_destroy(self, instance):
        if instance.sandbox_organization:
            instance.sandbox_organization.soft_delete()
        else:
            instance.prod_organization.soft_delete()
        instance.soft_delete()

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            update_organization = self.queryset.filter(id=self.kwargs.get("id")).first()
            if update_organization is None:
                raise ParseError("Organization not found")
            response = update_organization_service(
                organization=update_organization,
                serial_data=serializer.validated_data,
            )

            return Response(data=response, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
