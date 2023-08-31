from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    GenericAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination

from .models import RetailerQueueHistory
from .serializers import RetailerQueueHistorySerializer


class RetailerQueueHistoryMixinView(GenericAPIView):
    serializer_class = RetailerQueueHistorySerializer
    queryset = RetailerQueueHistory.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        organization_id = self.request.headers.get("organization")
        return self.queryset.filter(retailer__organization_id=organization_id)


class ListRetailerQueueHistoryView(RetailerQueueHistoryMixinView, ListAPIView):
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["created_at", "retailer__id"]
    search_fields = ["name", "retailer__name"]
    filterset_fields = ["status", "label"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        retailer_ids = self.request.query_params.get("retailer_ids")
        last = self.request.query_params.get("last")
        if last:
            queryset = queryset.order_by("retailer_id", "-created_at").distinct(
                "retailer_id"
            )
        if retailer_ids:
            list_ids = retailer_ids.split(",")
            list_ids = list(set(list_ids))
            queryset = queryset.filter(retailer_id__in=list_ids)

        return queryset

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "retailer_ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                "last",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            ),
            # ... add more parameters as needed ...
        ]
    )
    def get(self, request, *args, **kwargs):
        return super().get(self, request, *args, **kwargs)


class UpdateDeleteRetailerQueueHistoryView(
    RetailerQueueHistoryMixinView, RetrieveUpdateDestroyAPIView
):
    allowed_methods = ("GET",)
