from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.organization_members.models import OrganizationMember
from selleraxis.organizations.models import Organization
from selleraxis.organizations.serializers import OrganizationSerializer
from selleraxis.permissions.models import Permissions
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
        organization = serializer.save(created_by=self.request.user)

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

        OrganizationMember(
            user_id=self.request.user.id,
            role_id=roles[0].id,
        ).save()

        return organization

    def get_queryset(self):
        return self.queryset.filter(roles__members__user=self.request.user)


class UpdateDeleteOrganizationView(RetrieveUpdateDestroyAPIView):
    model = Organization
    serializer_class = OrganizationSerializer
    lookup_field = "id"
    queryset = Organization.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(roles__members__user=self.request.user)

    def check_permissions(self, _):
        match self.request.method:
            case "PUT" | "PATCH":
                return check_permission(self, Permissions.UPDATE_ORGANIZATION)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_ORGANIZATION)
