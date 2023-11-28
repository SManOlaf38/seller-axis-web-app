from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.package_rules.models import PackageRule
from selleraxis.package_rules.serializers import (
    PackageRuleSerializer,
    ReadPackageRuleSerializer,
)
from selleraxis.permissions.models import Permissions


class ListCreatePackageRuleView(ListCreateAPIView):
    model = PackageRule
    serializer_class = PackageRuleSerializer
    queryset = PackageRule.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["created_at"]
    search_fields = ["box__name", "product_series__series"]
    filterset_fields = ["box__name", "product_series__series"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadPackageRuleSerializer
        return PackageRuleSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PACKAGE_RULE)
            case _:
                return check_permission(self, Permissions.CREATE_PACKAGE_RULE)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(
            box__organization_id=organization_id
        ).select_related("product_series", "box")


class UpdateDeletePackageRuleView(RetrieveUpdateDestroyAPIView):
    model = PackageRule
    serializer_class = PackageRuleSerializer
    lookup_field = "id"
    queryset = PackageRule.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadPackageRuleSerializer
        return PackageRuleSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PACKAGE_RULE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PACKAGE_RULE)
            case _:
                return check_permission(self, Permissions.UPDATE_PACKAGE_RULE)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        if self.request.method == "GET":
            return self.queryset.filter(
                box__organization_id=organization_id
            ).select_related("product_series", "box")
        return self.queryset.filter(box__organization_id=organization_id)
