from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.addresses.models import Address
from selleraxis.addresses.serializers import AddressSerializer, ReadAddressSerializer
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions


class ListCreateAddressView(ListCreateAPIView):
    model = Address
    serializer_class = AddressSerializer
    queryset = Address.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["verified_carrier", "country"]
    search_fields = ["verified_carrier_", "country"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadAddressSerializer
        return AddressSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_ADDRESS)
            case _:
                return check_permission(self, Permissions.CREATE_ADDRESS)

    def perform_create(self, serializer):
        return serializer.save(organization_id=self.request.headers.get("organization"))

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(organization_id=organization_id)


class UpdateDeleteAddressView(RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    lookup_field = "id"
    queryset = Address.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadAddressSerializer
        return AddressSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_ADDRESS)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_ADDRESS)
            case _:
                return check_permission(self, Permissions.UPDATE_ADDRESS)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(organization_id=organization_id)
