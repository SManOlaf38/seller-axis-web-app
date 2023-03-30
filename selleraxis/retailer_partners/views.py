from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_partners.models import RetailerPartner
from selleraxis.retailer_partners.serializers import RetailerPartnerSerializer


class ListCreateRetailerPartnerView(ListCreateAPIView):
    model = RetailerPartner
    serializer_class = RetailerPartnerSerializer
    queryset = RetailerPartner.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["retailer_partner_id", "name", "created_at"]
    search_fields = ["retailer_partner_id", "name"]
    filterset_fields = ["retailer"]

    def get_queryset(self):
        return self.queryset.filter(
            retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PARTNER)
            case _:
                return check_permission(self, Permissions.CREATE_RETAILER_PARTNER)


class UpdateDeleteRetailerPartnerView(RetrieveUpdateDestroyAPIView):
    model = RetailerPartner
    serializer_class = RetailerPartnerSerializer
    lookup_field = "id"
    queryset = RetailerPartner.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PARTNER)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_RETAILER_PARTNER)
            case _:
                return check_permission(self, Permissions.UPDATE_RETAILER_PARTNER)
