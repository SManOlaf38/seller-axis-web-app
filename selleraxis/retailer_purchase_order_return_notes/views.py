from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions

from .models import RetailerPurchaseOrderReturnNote
from .serializers import (
    ReadRetailerPurchaseOrderReturnNoteSerializer,
    RetailerPurchaseOrderReturnNoteSerializer,
)


class ListCreateRetailerPurchaseOrderReturnNoteView(ListCreateAPIView):
    model = RetailerPurchaseOrderReturnNote
    serializer_class = RetailerPurchaseOrderReturnNoteSerializer
    queryset = RetailerPurchaseOrderReturnNote.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            order_return__order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderReturnNoteSerializer
        return RetailerPurchaseOrderReturnNoteSerializer

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PURCHASE_ORDER)
            case _:
                return check_permission(
                    self, Permissions.CREATE_RETAILER_PURCHASE_ORDER
                )


class UpdateDeleteRetailerPurchaseOrderReturnNoteView(RetrieveUpdateDestroyAPIView):
    model = RetailerPurchaseOrderReturnNote
    serializer_class = RetailerPurchaseOrderReturnNoteSerializer
    lookup_field = "id"
    queryset = RetailerPurchaseOrderReturnNote.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderReturnNoteSerializer
        return RetailerPurchaseOrderReturnNoteSerializer

    def get_queryset(self):
        return self.queryset.filter(
            order_return__order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PURCHASE_ORDER)
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_RETAILER_PURCHASE_ORDER
                )
            case _:
                return check_permission(
                    self, Permissions.UPDATE_RETAILER_PURCHASE_ORDER
                )

    def perform_update(self, serializer):
        note = self.get_object()
        if self.request.user != note.user:
            raise PermissionDenied("You do not have permission to update this note.")
        serializer.save()

    def perform_destroy(self, instance):
        print(instance.user)
        print(self.request.user)
        if self.request.user != instance.user:
            raise PermissionDenied("You do not have permission to delete this note.")
        instance.delete()
