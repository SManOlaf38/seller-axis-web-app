from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.retailers.models import Retailer
from selleraxis.retailers.serializers import ReadRetailerSerializer, RetailerSerializer
from selleraxis.retailers.services.create_xml import inventory_commecerhub
from selleraxis.retailers.services.import_data import import_purchase_order


class ListCreateRetailerView(ListCreateAPIView):
    model = Retailer
    serializer_class = RetailerSerializer
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["name", "created_at"]
    search_fields = ["name"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerSerializer
        return RetailerSerializer

    def perform_create(self, serializer):
        return serializer.save(organization_id=self.request.headers.get("organization"))

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER)
            case _:
                return check_permission(self, Permissions.CREATE_RETAILER)


class UpdateDeleteRetailerView(RetrieveUpdateDestroyAPIView):
    model = Retailer
    serializer_class = RetailerSerializer
    lookup_field = "id"
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadRetailerSerializer
        return RetailerSerializer

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_RETAILER)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_RETAILER)
            case _:
                return check_permission(self, Permissions.UPDATE_RETAILER)


class ImportDataPurchaseOrderView(RetrieveAPIView):
    model = Retailer
    serializer_class = RetailerSerializer
    lookup_field = "id"
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        import_purchase_order(instance)
        return Response("Succeed")

    def check_permissions(self, _):
        return check_permission(self, Permissions.IMPORT_RETAILER_PURCHASE_ORDER)


class RetailerInventoryXML(RetrieveAPIView):
    serializer_class = ReadRetailerSerializer
    lookup_field = "id"
    queryset = Retailer.objects.all()
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        retailer = self.get_object()
        serializer = self.serializer_class(retailer)
        inventory_commecerhub(serializer.data)
        return Response(serializer.data)

    def check_permissions(self, _):
        return check_permission(self, Permissions.EXPORT_XML_COMMERCEHUB)
