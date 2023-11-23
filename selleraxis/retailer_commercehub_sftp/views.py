import asyncio
import json

from asgiref.sync import async_to_sync, sync_to_async
from django.conf import settings
from django.contrib.postgres.aggregates import ArrayAgg
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from selleraxis.core.clients.boto3_client import sqs_client
from selleraxis.core.custom_permission import CustomPermission
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


class RetailerCommercehubSFTPGetOrderView(APIView):
    model = RetailerCommercehubSFTP
    queryset = RetailerCommercehubSFTP.objects.all()
    permission_classes = [CustomPermission]

    def get(self, request, *args, **kwargs):
        sftps = (
            RetailerCommercehubSFTP.objects.values(
                "sftp_host", "sftp_username", "sftp_password"
            )
            .annotate(retailers=ArrayAgg("retailer"))
            .order_by("sftp_host", "sftp_username", "sftp_password")
        )
        self.request_get_order(list(sftps))

        return Response({"detail": "Sent request get new order!"})

    @async_to_sync
    async def request_get_order(self, sftps) -> None:
        await asyncio.gather(*[self.request_sqs(sftp) for sftp in sftps])

    @sync_to_async
    def request_sqs(self, sftp) -> None:
        sqs_client.create_queue(
            message_body=json.dumps(sftp),
            queue_name=settings.SQS_GET_NEW_ORDER_BY_RETAILER_SFTP_GROUP_SQS_NAME,
        )
