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
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at", "retailer__id"]
    search_fields = ["name", "retailer__name"]


class UpdateDeleteRetailerQueueHistoryView(
    RetailerQueueHistoryMixinView, RetrieveUpdateDestroyAPIView
):
    allowed_methods = ("GET",)
