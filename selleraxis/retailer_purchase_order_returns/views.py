from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailer_purchase_order_histories.models import (
    RetailerPurchaseOrderHistory,
)
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_order_return_items.models import (
    RetailerPurchaseOrderReturnItem,
)
from selleraxis.retailer_purchase_order_return_notes.models import (
    RetailerPurchaseOrderReturnNote,
)
from selleraxis.retailer_purchase_orders.models import QueueStatus
from selleraxis.services.models import Services

from .models import DiputeStatus, RetailerPurchaseOrderReturn, Status
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

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        order_returns = response.data
        # extract all name and shipment_tracking_url of order returns one time
        service_names = [
            order_return.get("service", None) for order_return in order_returns
        ]
        service_instances = Services.objects.filter(name__in=service_names).values(
            "name", "shipment_tracking_url"
        )
        # add tracking_number and tracking_url to response
        for order_return in order_returns:
            service_name = order_return.get("service", None)
            tracking_numbers = order_return.get("tracking_number", None)
            shipment_tracking_url = None
            # get shipment_tracking_url of this service
            for service in service_instances:
                if service["name"] == service_name:
                    shipment_tracking_url = service["shipment_tracking_url"]
            new_tracking_numbers = []
            for number in tracking_numbers:
                tracking_url = None
                if shipment_tracking_url and number:
                    tracking_url = shipment_tracking_url + str(number)
                new_tracking_numbers.append(
                    {"number": str(number), "tracking_url": tracking_url}
                )
            order_return["tracking_number"] = new_tracking_numbers
        return Response(order_returns)

    @transaction.atomic
    def perform_create(self, serializer):
        dispute_reason = serializer.validated_data.get("dispute_reason")
        dispute_at = serializer.validated_data.get("dispute_at")
        if (dispute_at is not None) != (dispute_reason is not None):
            raise ValidationError(
                "To add a dispute, both dispute_reason and dispute_at must be provided"
            )
        elif dispute_reason and dispute_at:
            serializer.validated_data["updated_dispute_at"] = dispute_at
            serializer.validated_data["dispute_status"] = DiputeStatus.Requested
        else:
            serializer.validated_data.pop("dispute_at")
            serializer.validated_data.pop("dispute_reason")
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
            error_message = "Status of order must be Shipment Confirmed, Partly Shipped Confirmed,\
            Invoice or invoice Confirmed"
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


class RetrieveRetailerPurchaseOrderReturnView(RetrieveUpdateDestroyAPIView):
    model = RetailerPurchaseOrderReturn
    lookup_field = "id"
    serializer_class = ReadRetailerPurchaseOrderReturnSerializer
    queryset = RetailerPurchaseOrderReturn.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "delete"]

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

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        service_name = response.data.get("service", None)
        tracking_numbers = response.data.get("tracking_number", None)
        if service_name and tracking_numbers:
            service_instance = Services.objects.filter(name=service_name).first()
            shipment_tracking_url = None
            if service_instance:
                shipment_tracking_url = service_instance.shipment_tracking_url
            new_tracking_numbers = []
            for number in tracking_numbers:
                tracking_url = None
                if shipment_tracking_url and number:
                    tracking_url = shipment_tracking_url + str(number)
                new_tracking_numbers.append(
                    {"number": str(number), "tracking_url": tracking_url}
                )
            response.data["tracking_number"] = new_tracking_numbers
        return response

    @transaction.atomic
    def perform_update(self, serializer):
        instance = self.get_object()
        input_fields = set(serializer.validated_data.keys())
        received_fields = {"status"}
        if received_fields == input_fields:
            self.action_received_return_item(instance, serializer)
        elif {"order_returns_items"}.issubset(input_fields) or {"notes"}.issubset(
            input_fields
        ):
            self.action_edit_order_return(instance, serializer)
        else:
            serializer.save()
        return serializer

    def action_edit_order_return(self, instance, serializer):
        now = timezone.now()
        order_returns_items = serializer.validated_data.pop("order_returns_items", None)
        notes = serializer.validated_data.pop("notes", None)
        if notes:
            note_instances = [
                RetailerPurchaseOrderReturnNote(updated_at=now, **note_data)
                for note_data in notes
            ]
            RetailerPurchaseOrderReturnNote.objects.bulk_update(
                note_instances, ["details", "updated_at"]
            )

        if order_returns_items:
            item_instances = []
            for item_data in order_returns_items:
                item_instances.append(
                    RetailerPurchaseOrderReturnItem(
                        updated_at=now, order_return=instance, **item_data
                    )
                )
            RetailerPurchaseOrderReturnItem.objects.bulk_update(
                item_instances, ["return_qty", "damaged_qty", "reason", "updated_at"]
            )
        serializer.save()

    def action_received_return_item(self, instance, serializer):
        old_status = instance.status
        new_status = serializer.validated_data.get("status")
        if old_status == Status.Return_opened and new_status == Status.Return_receive:
            return_item_instances = instance.order_returns_items.all()
            bulk_update_product_quantity_when_return(
                return_item_instances=return_item_instances,
                order_return_status=Status.Return_opened,
                delete=False,
            )
            serializer.validated_data["status"] = Status.Return_receive
            serializer.save()
        else:
            raise ValidationError(
                "The current status of order return is not eligible to perform this action"
            )

    @transaction.atomic
    def perform_destroy(self, instance):
        order_return_status = instance.status
        if order_return_status == Status.Return_receive:
            return_item_instances = instance.order_returns_items.all()
            bulk_update_product_quantity_when_return(
                return_item_instances=return_item_instances,
                order_return_status=instance.status,
                delete=True,
            )
            # the status of the order will change to before order return
            order = instance.order
            order_historys = RetailerPurchaseOrderHistory.objects.filter(
                order__id=instance.order.id
            ).values("status")
            order_historys = list(order_historys)
            previous_status = order_historys[-2]["status"]
            order.status = previous_status
            order.save()
        instance.delete()

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
            case "DELETE":
                return check_permission(
                    self, Permissions.DELETE_RETAILER_PURCHASE_ORDER_RETURN
                )
