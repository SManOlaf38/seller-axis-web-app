import json

from django.contrib.postgres.aggregates import ArrayAgg
from django.core.cache import cache
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from selleraxis.core.custom_permission import CustomPermission
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.getting_order_histories.models import GettingOrderHistory
from selleraxis.organizations.models import Organization
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_commercehub_sftp.serializers import (
    ReadRetailerCommercehubSFTPSerializer,
    RetailerCommercehubSFTPSerializer,
)

from .tasks import retailer_getting_order

CHECK_ORDER_CACHE_KEY_PREFIX = "order_check_{}"
NEXT_EXCUTION_TIME_CACHE = "next_excution_{}"


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


class RetailerCommercehubSFTPGetOrderView(APIView):
    permission_classes = [CustomPermission]

    def get(self, request, *args, **kwargs):
        organizations = Organization.objects.values("id", "name").annotate(
            retailers=ArrayAgg("retailer_organization")
        )
        for organization in organizations:
            history = GettingOrderHistory.objects.create(
                organization_id=organization["id"]
            )
            retailer_getting_order.trigger(
                json.dumps(organization["retailers"]), history.id
            )
            cache_key_check_order = CHECK_ORDER_CACHE_KEY_PREFIX.format(
                organization["id"]
            )
            cache_key_next_excution = NEXT_EXCUTION_TIME_CACHE.format(
                organization["id"]
            )

            cache.delete(cache_key_check_order)
            cache.delete(cache_key_next_excution)

        return Response({"detail": "Requested retailer getting order!"})
