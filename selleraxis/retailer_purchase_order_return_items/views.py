from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions

from .models import RetailerPurchaseOrderReturnItem
from .serializers import (
    ReadRetailerPurchaseOrderReturnItemSerializer,
    RetailerPurchaseOrderReturnItemSerializer,
)
from .services import create_order_return_item_service


class ListCreateRetailerPurchaseOrderReturnItemView(ListCreateAPIView):
    model = RetailerPurchaseOrderReturnItem
    serializer_class = RetailerPurchaseOrderReturnItemSerializer
    queryset = RetailerPurchaseOrderReturnItem.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            order_return__order__batch__retailer__organization_id=self.request.headers.get(
                "organization"
            )
        ).select_related("item__order__batch")

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerPurchaseOrderReturnItemSerializer
        return RetailerPurchaseOrderReturnItemSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            order_return = serializer.validated_data.get("order_return")
            unbroken_qty = serializer.validated_data.get("unbroken_qty")
            # add unbroken_quantity to quantity on hand and update status order
            create_order_return_item_service(order_return, serializer, unbroken_qty)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER_PURCHASE_ORDER)
            case _:
                return check_permission(
                    self, Permissions.CREATE_RETAILER_PURCHASE_ORDER
                )


class RetrieveRetailerPurchaseOrderReturnItemView(RetrieveAPIView):
    model = RetailerPurchaseOrderReturnItem
    lookup_field = "id"
    serializer_class = ReadRetailerPurchaseOrderReturnItemSerializer
    queryset = RetailerPurchaseOrderReturnItem.objects.all()
    permission_classes = [IsAuthenticated]

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
