from asgiref.sync import async_to_sync
from django.contrib.postgres.aggregates import ArrayAgg
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from selleraxis.core.clients.sftp_client import ClientError, CommerceHubSFTPClient
from selleraxis.core.custom_permission import CustomPermission
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_commercehub_sftp.serializers import (
    ReadRetailerCommercehubSFTPSerializer,
    RetailerCommercehubSFTPSerializer,
)
from selleraxis.retailer_commercehub_sftp.services import from_retailer_import_order


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
        sftps = (
            RetailerCommercehubSFTP.objects.values(
                "sftp_host", "sftp_username", "sftp_password"
            )
            .annotate(retailers=ArrayAgg("retailer"))
            .order_by("sftp_host", "sftp_username", "sftp_password")
        )
        responses = {"detail": "Requested retailer getting order!", "sftps": []}
        for sftp in sftps:
            response = {
                "sftp_host": sftp["sftp_host"],
                "sftp_username": sftp["sftp_username"],
                "retailers": [],
            }
            error = False
            try:
                sftp_client = CommerceHubSFTPClient(
                    sftp_host=sftp["sftp_host"],
                    sftp_username=sftp["sftp_username"],
                    sftp_password=sftp["sftp_password"],
                )
                sftp_client.connect()
            except ClientError:
                response["message"] = "Could not connect SFTP client"
                error = True
            if error is False:
                for retailer_id in sftp["retailers"]:
                    retailer = async_to_sync(from_retailer_import_order)(
                        retailers_sftp_client=sftp_client, retailer_id=retailer_id
                    )
                    response["retailers"].append(retailer)
            sftp_client.close()
            responses["sftps"].append(response)
        return Response(responses)
