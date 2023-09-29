import json

from django.conf import settings
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.clients.boto3_client import sqs_client
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_warehouse_products.models import RetailerWarehouseProduct
from selleraxis.retailer_warehouse_products.serializers import (
    ReadRetailerWarehouseProductSerializer,
    RetailerWarehouseProductSerializer,
)


class ListCreateRetailerWarehouseProductView(ListCreateAPIView):
    model: RetailerWarehouseProduct
    serializer_class = RetailerWarehouseProductSerializer
    queryset = RetailerWarehouseProduct.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at", "product_alias", "retailer_warehouse"]
    search_fields = ["product_alias", "retailer_warehouse"]

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(
            product_alias__retailer__organization_id=organization_id
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerWarehouseProductSerializer
        return RetailerWarehouseProductSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT)

    def post(self, request, *args, **kwargs):
        serializer = RetailerWarehouseProductSerializer(data=request.data)
        if serializer.is_valid():
            new_retailer_warehouse = RetailerWarehouseProduct(
                product_alias=serializer.validated_data["product_alias"],
                retailer_warehouse=serializer.validated_data["retailer_warehouse"],
            )
            new_retailer_warehouse.save()
            dict_data = [
                {
                    "retailer_id": serializer.validated_data[
                        "product_alias"
                    ].retailer.id,
                    "product_alias_ids": str(
                        serializer.validated_data["product_alias"].id
                    ),
                }
            ]
            message_body = json.dumps(dict_data)
            sqs_client.create_queue(
                message_body=message_body,
                queue_name=settings.SQS_UPDATE_INVENTORY_TO_COMMERCEHUB_SQS_NAME,
            )
            result = RetailerWarehouseProductSerializer(
                instance=new_retailer_warehouse, many=False
            )
            return Response(data=result.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateDeleteRetailerWarehouseProductView(RetrieveUpdateDestroyAPIView):
    serializer_class = RetailerWarehouseProductSerializer
    lookup_field = "id"
    queryset = RetailerWarehouseProduct.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerWarehouseProductSerializer
        return RetailerWarehouseProductSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT)

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(
            product_alias__retailer__organization_id=organization_id
        )
