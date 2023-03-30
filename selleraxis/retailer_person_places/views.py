from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_person_places.models import RetailerPersonPlace
from selleraxis.retailer_person_places.serializers import RetailerPersonPlaceSerializer


class ListCreateRetailerPersonPlaceView(ListCreateAPIView):
    model = RetailerPersonPlace
    serializer_class = RetailerPersonPlaceSerializer
    queryset = RetailerPersonPlace.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["retailer_person_place_id", "name", "created_at"]
    search_fields = ["retailer_person_place_id", "name"]
    filterset_fields = ["retailer"]

    def get_queryset(self):
        return self.queryset.filter(
            retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PERSON_PLACE)
            case _:
                return check_permission(self, Permissions.CREATE_RETAILER_PERSON_PLACE)


class UpdateDeleteRetailerPersonPlaceView(RetrieveUpdateDestroyAPIView):
    model = RetailerPersonPlace
    serializer_class = RetailerPersonPlaceSerializer
    lookup_field = "id"
    queryset = RetailerPersonPlace.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            retailer__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PERSON_PLACE)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_RETAILER_PERSON_PLACE)
            case _:
                return check_permission(self, Permissions.UPDATE_RETAILER_PERSON_PLACE)
