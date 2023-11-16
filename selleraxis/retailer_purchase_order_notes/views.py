from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.retailer_purchase_order_notes.models import RetailerPurchaseOrderNote
from selleraxis.retailer_purchase_order_notes.serializers import (
    CreateUpdateNoteSerializer,
    ReadRetailerPurchaseOrderNoteSerializer,
    RetailerPurchaseOrderNoteSerializer,
)


class ListCreateRetailerPurchaseOrderNoteView(ListCreateAPIView):
    model = RetailerPurchaseOrderNote
    serializer_class = RetailerPurchaseOrderNoteSerializer
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

    def create(self, request, *args, **kwargs):
        serializer = CreateUpdateNoteSerializer(
            data=request.data, context={"view": self}
        )
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        note = RetailerPurchaseOrderNote.objects.create(
            user=self.request.user,
            order_id=validated_data.get("order"),
            details=validated_data.get("details"),
        )

        return Response(
            RetailerPurchaseOrderNoteSerializer(note).data, status.HTTP_201_CREATED
        )


class UpdateDeleteRetailerPurchaseOrderNoteView(RetrieveUpdateDestroyAPIView):
    model = RetailerPurchaseOrderNote
    serializer_class = RetailerPurchaseOrderNoteSerializer
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

    def update(self, request, *args, **kwargs):
        note = self.get_object()
        serializer = CreateUpdateNoteSerializer(
            data=request.data, context={"view": self}
        )
        serializer.is_valid(raise_exception=True)
        note.order_id = serializer.validated_data.get("order")
        note.details = serializer.validated_data.get("details")
        note.save()
        return Response(
            RetailerPurchaseOrderNoteSerializer(note).data, status=status.HTTP_200_OK
        )
