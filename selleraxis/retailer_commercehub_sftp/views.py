from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_commercehub_sftp.serializers import (
    ReadRetailerCommercehubSFTPSerializer,
    RetailerCommercehubSFTPSerializer,
)


class ListCreateRetailerCommercehubSFTPView(ListCreateAPIView):
    model: RetailerCommercehubSFTP
    serializer_class = RetailerCommercehubSFTPSerializer
    queryset = RetailerCommercehubSFTP.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at", "retailer__id"]
    search_fields = ["retailer__id"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerCommercehubSFTPSerializer
        return RetailerCommercehubSFTPSerializer

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(retailer__organization_id=organization_id)

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_COMMERCEHUB_SFTP)
            case _:
                return check_permission(self, Permissions.CREATE_COMMERCEHUB_SFTP)


class UpdateDeleteRetailerCommercehubSFTPView(RetrieveUpdateDestroyAPIView):
    serializer_class = RetailerCommercehubSFTPSerializer
    lookup_field = "id"
    queryset = RetailerCommercehubSFTP.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerCommercehubSFTPSerializer
        return RetailerCommercehubSFTPSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_COMMERCEHUB_SFTP)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_COMMERCEHUB_SFTP)
            case _:
                return check_permission(self, Permissions.UPDATE_COMMERCEHUB_SFTP)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(retailer__organization_id=organization_id)
