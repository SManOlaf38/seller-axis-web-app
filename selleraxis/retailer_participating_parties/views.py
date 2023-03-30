from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_participating_parties.models import RetailerParticipatingParty
from selleraxis.retailer_participating_parties.serializers import (
    RetailerParticipatingPartySerializer,
)


class ListCreateRetailerParticipatingPartyView(ListCreateAPIView):
    model = RetailerParticipatingParty
    serializer_class = RetailerParticipatingPartySerializer
    queryset = RetailerParticipatingParty.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["retailer_participating_party_id", "name", "created_at"]
    search_fields = ["retailer_participating_party_id", "name"]
    filterset_fields = ["retailer"]

    def get_queryset(self):
        return self.queryset.filter(
            retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PARTICIPATING_PARTY
                )
            case _:
                return check_permission(
                    self, Permissions.CREATE_RETAILER_PARTICIPATING_PARTY
                )


class UpdateDeleteRetailerParticipatingPartyView(RetrieveUpdateDestroyAPIView):
    model = RetailerParticipatingParty
    serializer_class = RetailerParticipatingPartySerializer
    lookup_field = "id"
    queryset = RetailerParticipatingParty.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PARTICIPATING_PARTY
                )
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_RETAILER_PARTICIPATING_PARTY
                )
            case _:
                return check_permission(
                    self, Permissions.UPDATE_RETAILER_PARTICIPATING_PARTY
                )
