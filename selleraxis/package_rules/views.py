from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.package_rules.models import PackageRule
from selleraxis.package_rules.serializers import PackageRuleSerializer
from selleraxis.permissions.models import Permissions


class ListCreatePackageRuleView(ListCreateAPIView):
    model = PackageRule
    serializer_class = PackageRuleSerializer
    queryset = PackageRule.objects.all()
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
                return check_permission(self, Permissions.READ_PACKAGE_RULE)
            case _:
                return check_permission(self, Permissions.CREATE_PACKAGE_RULE)


class UpdateDeletePackageRuleView(RetrieveUpdateDestroyAPIView):
    model = PackageRule
    serializer_class = PackageRuleSerializer
    lookup_field = "id"
    queryset = PackageRule.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PACKAGE_RULE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PACKAGE_RULE)
            case _:
                return check_permission(self, Permissions.UPDATE_PACKAGE_RULE)
