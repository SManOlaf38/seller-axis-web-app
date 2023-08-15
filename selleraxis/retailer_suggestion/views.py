from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.retailer_suggestion.models import RetailerSuggestion
from selleraxis.retailer_suggestion.serializers import RetailerSuggestionSerializer


class RetailerSuggestionAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    serializer_class = RetailerSuggestionSerializer
    ordering_fields = ["created_at"]
    filterset_fields = ["type", "merchant_id"]
    queryset = RetailerSuggestion.objects.all()
