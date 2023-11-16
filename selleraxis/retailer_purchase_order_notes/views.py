from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    get_object_or_404,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.retailer_purchase_order_notes.models import RetailerPurchaseOrderNote
from selleraxis.retailer_purchase_order_notes.serializers import (
    CreateUpdateNoteSerializer,
    ReadRetailerPurchaseOrderNoteSerializer,
)


class ListCreateRetailerPurchaseOrderNoteView(ListCreateAPIView):
    model = RetailerPurchaseOrderNote
    serializer_class = ReadRetailerPurchaseOrderNoteSerializer
    queryset = RetailerPurchaseOrderNote.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ["retailer_purchase_order_item_id", "created_at"]
    search_fields = ["user__last_name", "user__first_name", "order"]
    filterset_fields = ["order", "user"]

    def get_queryset(self):
        return self.queryset.filter(
            order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderNoteSerializer
        return CreateUpdateNoteSerializer

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class UpdateDeleteRetailerPurchaseOrderNoteView(RetrieveUpdateDestroyAPIView):
    model = RetailerPurchaseOrderNote
    serializer_class = ReadRetailerPurchaseOrderNoteSerializer
    lookup_field = "id"
    queryset = RetailerPurchaseOrderNote.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderNoteSerializer
        return CreateUpdateNoteSerializer

    def get_queryset(self):
        return self.queryset.filter(
            order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        )

    def perform_update(self, serializer):
        try:
            RetailerPurchaseOrderNote.objects.get(
                id=self.kwargs["id"], user=self.request.user.id
            )
        except RetailerPurchaseOrderNote.DoesNotExist:
            raise ValidationError("Can not edit another user's note")
        return serializer.save()

    def delete(self, request, *args, **kwargs):
        note = get_object_or_404(self.get_queryset(), id=self.kwargs["id"])
        if note.user != self.request.user:
            return Response(
                {"data": "Can not delete another user's note"},
                status=status.HTTP_403_FORBIDDEN,
            )
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
