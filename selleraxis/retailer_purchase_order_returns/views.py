from django.db import transaction
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_order_return_items.models import (
    RetailerPurchaseOrderReturnItem,
)
from selleraxis.retailer_purchase_order_return_notes.models import (
    RetailerPurchaseOrderReturnNote,
)
from selleraxis.retailer_purchase_orders.models import QueueStatus

from .models import RetailerPurchaseOrderReturn
from .serializers import (
    ReadRetailerPurchaseOrderReturnSerializer,
    RetailerPurchaseOrderReturnSerializer,
    UpdateRetailerPurchaseOrderReturnSerializer,
)
from .services import (
    bulk_update_product_quantity_when_return,
    change_status_when_return,
)


class ListCreateRetailerPurchaseOrderReturnView(ListCreateAPIView):
    model = RetailerPurchaseOrderReturn
    serializer_class = RetailerPurchaseOrderReturnSerializer
    queryset = RetailerPurchaseOrderReturn.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        ).prefetch_related(
            "order_returns_items__item__order__batch",
            "notes",
        )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderReturnSerializer
        return RetailerPurchaseOrderReturnSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        notes = serializer.validated_data.pop("notes")
        order_returns_items = serializer.validated_data.pop("order_returns_items")
        # Check order status condition
        order = serializer.validated_data.get("order")
        if order.status not in [
            QueueStatus.Shipment_Confirmed,
            QueueStatus.Partly_Shipped_Confirmed,
            QueueStatus.Invoiced,
            QueueStatus.Invoice_Confirmed,
        ]:
            error_message = (
                "Status of order must be Shipment Confirmed or Partly Shipped Confirmed"
            )
            raise ValidationError(error_message)
        order_return_instance = serializer.save()
        # Create list note instances
        note_instances = [
            RetailerPurchaseOrderReturnNote(
                user=self.request.user, order_return=order_return_instance, **note_data
            )
            for note_data in notes
        ]
        note_objs = RetailerPurchaseOrderReturnNote.objects.bulk_create(note_instances)
        # Create list item instances
        item_instances = []
        items_in_order = RetailerPurchaseOrderItem.objects.filter(order=order)
        for item_data in order_returns_items:
            if item_data.get("item") not in items_in_order:
                raise ValidationError("the item does not belong for the order")
            item_instances.append(
                RetailerPurchaseOrderReturnItem(
                    order_return=order_return_instance, **item_data
                )
            )
        return_item_instances = RetailerPurchaseOrderReturnItem.objects.bulk_create(
            item_instances
        )
        bulk_update_product_quantity_when_return(
            return_item_instances=return_item_instances,
        )
        change_status_when_return(order=order)
        order_return_instance.notes.set(note_objs)
        order_return_instance.order_returns_items.set(return_item_instances)
        return order_return_instance

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PURCHASE_ORDER_RETURN
                )
            case _:
                return check_permission(
                    self, Permissions.CREATE_RETAILER_PURCHASE_ORDER_RETURN
                )


class RetrieveRetailerPurchaseOrderReturnView(RetrieveUpdateAPIView):
    model = RetailerPurchaseOrderReturn
    lookup_field = "id"
    serializer_class = ReadRetailerPurchaseOrderReturnSerializer
    queryset = RetailerPurchaseOrderReturn.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderReturnSerializer
        return UpdateRetailerPurchaseOrderReturnSerializer

    def get_queryset(self):
        return self.queryset.filter(
            order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        ).prefetch_related(
            "order_returns_items__item__order__batch",
            "notes",
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PURCHASE_ORDER_RETURN
                )
            case "PATCH":
                return check_permission(
                    self, Permissions.UPDATE_RETAILER_PURCHASE_ORDER_RETURN
                )
