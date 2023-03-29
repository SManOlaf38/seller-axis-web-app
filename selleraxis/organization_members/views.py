from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.organization_members.models import OrganizationMember
from selleraxis.organization_members.serializers import OrganizationMemberSerializer
from selleraxis.permissions.models import Permissions


class ListCreateOrganizationMemberView(ListCreateAPIView):
    model = OrganizationMember
    serializer_class = OrganizationMemberSerializer
    queryset = OrganizationMember.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at"]
    search_fields = ["name"]

    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_MEMBER)
            case _:
                return check_permission(self, Permissions.INVITE_MEMBER)


class UpdateDeleteOrganizationMemberView(RetrieveUpdateDestroyAPIView):
    model = OrganizationMember
    serializer_class = OrganizationMemberSerializer
    lookup_field = "id"
    queryset = OrganizationMember.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_MEMBER)
            case "DELETE":
                return check_permission(self, Permissions.REMOVE_MEMBER)
            case _:
                return check_permission(self, Permissions.UPDATE_MEMBER_ROLE)
