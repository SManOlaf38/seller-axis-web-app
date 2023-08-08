from rest_framework import status
from rest_framework.generics import CreateAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from selleraxis.invoice.serializers import CodeSerializer, InvoiceSerializer
from selleraxis.invoice.services import create_token, get_authorization_url
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.retailer_purchase_orders.serializers import (
    ReadRetailerPurchaseOrderSerializer,
)


class GetQBOAuthorizationURLView(APIView):
    """
    get the code of quick book online
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        return url get code
        """
        auth_url = get_authorization_url()
        return Response(auth_url, status=status.HTTP_200_OK)


class CreateQBOTokenView(CreateAPIView):
    """
    Create token QBO
    """

    permission_classes = [IsAuthenticated]
    serializer_class = CodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            auth_code = serializer.validated_data.get("auth_code")
            realm_id = serializer.validated_data.get("realm_id")
            token = create_token(auth_code, realm_id)
            return Response(token, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RefreshQBOTokenView(CreateAPIView):
    """
    Create token QBO
    """

    permission_classes = [IsAuthenticated]
    serializer_class = CodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            auth_code = serializer.validated_data.get("auth_code")
            realm_id = serializer.validated_data.get("realm_id")
            token = create_token(auth_code, realm_id)
            return Response(token, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateInvoiceView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = RetailerPurchaseOrder.objects.all()
    serializer_class = ReadRetailerPurchaseOrderSerializer()

    def get_serializer(self, *args, **kwargs):
        return InvoiceSerializer(*args, **kwargs)

    def get_queryset(self):
        return (
            self.queryset.filter(
                batch__retailer__organization_id=self.request.headers.get(
                    "organization"
                )
            )
            .select_related(
                "ship_to",
                "bill_to",
                "invoice_to",
                "verified_ship_to",
                "customer",
                "batch__retailer",
                "carrier",
            )
            .prefetch_related("items")
        )

    def post(self, request, pk, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()
        order = get_object_or_404(self.get_queryset(), id=pk)
        serializer_order = ReadRetailerPurchaseOrderSerializer(order)
        return Response(data=serializer_order.data, status=status.HTTP_200_OK)
