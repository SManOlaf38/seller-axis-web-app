from django.conf import settings
from django.db.models import OuterRef, Subquery
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.clients.boto3_client import sqs_client
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.core.views import BulkUpdateAPIView
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.product_alias.serializers import (
    BulkUpdateProductAliasSerializer,
    ProductAliasSerializer,
    ReadProductAliasSerializer,
)
from selleraxis.retailer_queue_histories.models import RetailerQueueHistory


class ListCreateProductAliasView(ListCreateAPIView):
    model = ProductAlias
    serializer_class = ProductAliasSerializer
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["product", "retailer", "created_at"]
    search_fields = ["merchant_sku", "retailer__name"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductAliasSerializer
        return ProductAliasSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_ALIAS)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT_ALIAS)

    def get_queryset(self):
        retailer_queue_history_subquery = (
            RetailerQueueHistory.objects.filter(
                label=RetailerQueueHistory.Label.INVENTORY,
                retailer=OuterRef("retailer__id"),
            )
            .order_by("-created_at")
            .values("result_url")[:1]
        )
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(retailer__organization_id=organization_id).annotate(
            last_queue_history=Subquery(retailer_queue_history_subquery)
        )


class UpdateDeleteProductAliasView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductAliasSerializer
    lookup_field = "id"
    queryset = ProductAlias.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductAliasSerializer
        return ProductAliasSerializer

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT_ALIAS)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT_ALIAS)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT_ALIAS)

    def get_queryset(self):
        retailer_queue_history_subquery = (
            RetailerQueueHistory.objects.filter(
                label=RetailerQueueHistory.Label.INVENTORY,
                retailer=OuterRef("retailer__id"),
            )
            .order_by("-created_at")
            .values("result_url")[:1]
        )
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(retailer__organization_id=organization_id).annotate(
            last_queue_history=Subquery(retailer_queue_history_subquery)
        )


class BulkUpdateProductAliasView(BulkUpdateAPIView):
    queryset = ProductAlias.objects.all()
    serializer_class = BulkUpdateProductAliasSerializer

    def perform_update(self, serializer):
        serializer.save()
        retailer_ids = [str(instance.retailer_id) for instance in serializer.instance]
        sqs_client.create_queue(
            message_body=",".join(retailer_ids),
            queue_name=settings.SQS_UPDATE_RETAILER_INVENTORY_SQS_NAME,
        )
