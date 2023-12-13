from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.models import Product
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
)
from .services import change_status_when_return


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

    def perform_create(self, serializer):
        notes = serializer.validated_data.pop("notes")
        order_returns_items = serializer.validated_data.pop("order_returns_items")
        # Check order status condition
        order = serializer.validated_data.get("order")
        if order.status not in [
            QueueStatus.Shipment_Confirmed,
            QueueStatus.Partly_Shipped_Confirmed,
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
        item_objs = RetailerPurchaseOrderReturnItem.objects.bulk_create(item_instances)
        # Add return quantity from order_return_item to quantity_on_hand of the product
        products_to_update = []
        for item_obj in item_objs:
            product_alias = (
                ProductAlias.objects.filter(
                    merchant_sku=item_obj.item.merchant_sku,
                    retailer_id=item_obj.item.order.batch.retailer_id,
                )
                .select_related("product")
                .last()
            )
            try:
                product = product_alias.product
            except Exception:
                raise NotFound("Product not found for the item")

            sku_quantity = product_alias.sku_quantity
            product.qty_on_hand += item_obj.return_qty * sku_quantity
            products_to_update.append(product)
        Product.objects.bulk_update(products_to_update, ["qty_on_hand"])
        change_status_when_return(order=order)
        order_return_instance.notes.set(note_objs)
        order_return_instance.order_returns_items.set(item_objs)
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


class RetrieveRetailerPurchaseOrderReturnView(RetrieveAPIView):
    model = RetailerPurchaseOrderReturn
    lookup_field = "id"
    serializer_class = ReadRetailerPurchaseOrderReturnSerializer
    queryset = RetailerPurchaseOrderReturn.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(
                    self, Permissions.READ_RETAILER_PURCHASE_ORDER_RETURN
                )
