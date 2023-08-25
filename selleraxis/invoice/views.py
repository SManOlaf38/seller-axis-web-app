from rest_framework import status
from rest_framework.generics import CreateAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from selleraxis.invoice.exceptions import InvoiceInvalidException, TokenInvalidException
from selleraxis.invoice.models import Invoice
from selleraxis.invoice.serializers import (
    CodeSerializer,
    InvoiceSerializer,
    RefreshTokenSerializer,
)
from selleraxis.invoice.services import (
    create_invoice,
    create_token,
    get_authorization_url,
    get_refresh_access_token,
    save_invoices,
)
from selleraxis.retailer_purchase_orders.models import (
    QueueStatus,
    RetailerPurchaseOrder,
)
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
    Refresh access token
    """

    permission_classes = [IsAuthenticated]
    serializer_class = RefreshTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = RefreshTokenSerializer(data=request.data)
        if serializer.is_valid():
            refresh_token = serializer.validated_data.get("refresh_token")
            token = get_refresh_access_token(refresh_token)
            return Response(token, status=status.HTTP_200_OK)
        return TokenInvalidException


class CreateInvoiceView(APIView):
    """
    Create invoice
    """

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
        access_token = serializer.validated_data.get("access_token")
        realm_id = serializer.validated_data.get("realm_id")
        order = get_object_or_404(self.get_queryset(), id=pk)
        serializer_order = ReadRetailerPurchaseOrderSerializer(order)
        data = create_invoice(serializer_order)
        result = save_invoices(access_token, realm_id, data)
        if Invoice.objects.filter(order_id=pk).exists():
            raise InvoiceInvalidException
        Invoice.objects.create(
            doc_number=str(result["Invoice"]["DocNumber"]),
            invoice_id=str(result["Invoice"]["Id"]),
            order=order,
        )
        order.status = QueueStatus.Invoiced.value
        order.save()
        return Response(data=result, status=status.HTTP_200_OK)
