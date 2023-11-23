import asyncio

from asgiref.sync import async_to_sync, sync_to_async
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.exceptions import ParseError, ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    CreateAPIView,
    GenericAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from selleraxis.core.custom_permission import CustomPermission
from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.organizations.models import Organization
from selleraxis.permissions.models import Permissions
from selleraxis.products.exceptions import ProductIsEmptyArray
from selleraxis.products.models import Product
from selleraxis.products.serializers import (
    BulkCreateProductSerializer,
    CreateQuickbookProductSerializer,
    ProductSerializer,
    ReadProductSerializer,
)
from selleraxis.products.services import (
    base64_put_image_s3,
    create_quickbook_product_service,
    is_base64,
    is_s3_url,
    is_valid_url,
    update_quickbook_product_service,
    url_put_image_s3,
)


class ListCreateProductView(ListCreateAPIView):
    model: Product
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = [
        "sku",
        "unit_of_measure",
        "available",
        "upc",
        "product_series__series",
        "unit_cost",
        "weight_unit",
        "qty_on_hand",
        "qty_pending",
        "qty_reserve",
        "description",
        "created_at",
    ]
    search_fields = ["sku", "upc", "product_series__series"]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductSerializer
        return ProductSerializer

    def get_queryset(self):
        return self.queryset.filter(
            product_series__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT)
            case _:
                return check_permission(self, Permissions.CREATE_PRODUCT)


class UpdateDeleteProductView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    lookup_field = "id"
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return ReadProductSerializer
        return ProductSerializer

    def get_queryset(self):
        return self.queryset.filter(
            product_series__organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_PRODUCT)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_PRODUCT)
            case _:
                return check_permission(self, Permissions.UPDATE_PRODUCT)


class BulkCreateProductView(CreateAPIView):
    serializer_class = BulkCreateProductSerializer
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if len(request.data) == 0:
            raise ProductIsEmptyArray
        data = request.data
        for item in data:
            image = item["image"]
            if image is not None:
                if not is_s3_url(image):
                    if is_valid_url(image):
                        item["image"] = url_put_image_s3(image)
                    elif is_base64(image):
                        item["image"] = base64_put_image_s3(image)
                    else:
                        item["image"] = None
                else:
                    item["image"] = image

        serializer = BulkCreateProductSerializer(
            data=data,
            many=True,
            context={
                "request": self.request,
                "format": self.format_kwarg,
                "view": self,
            },
        )
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BulkDeleteProductView(
    GenericAPIView,
):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            )
        ]
    )
    def delete(self, request, *args, **kwargs):
        ids = request.query_params.get("ids")
        organization_id = self.request.headers.get("organization")
        if ids:
            list_id = ids.split(",")
            Product.objects.filter(
                id__in=list_id, product_series__organization_id=organization_id
            ).delete()
        return Response(
            data={"data": "Products deleted successfully"},
            status=status.HTTP_200_OK,
        )


class BulkProductView(BulkDeleteProductView, BulkCreateProductView):
    serializer_class = ProductSerializer


class QuickbookCreateProduct(GenericAPIView):
    permission_classes = [CustomPermission]

    def post(self, request, *args, **kwargs):
        serializer = CreateQuickbookProductSerializer(data=request.data)
        if serializer.is_valid():
            product_to_qbo = Product.objects.filter(
                id=serializer.validated_data.get("object_id")
            ).first()
            if product_to_qbo is None:
                raise ParseError("Product not found")
            if product_to_qbo.product_series is None:
                raise ParseError("Product not have product series")
            response = create_quickbook_product_service(
                action=serializer.validated_data.get("action"),
                model=serializer.validated_data.get("model"),
                product_to_qbo=product_to_qbo,
                is_sandbox=serializer.validated_data.get("is_sandbox"),
            )
            return Response(data={"data": response}, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuickbookUpdateProduct(GenericAPIView):
    permission_classes = [CustomPermission]

    def patch(self, request, *args, **kwargs):
        serializer = CreateQuickbookProductSerializer(data=request.data)
        if serializer.is_valid():
            product_to_qbo = Product.objects.filter(
                id=serializer.validated_data.get("object_id")
            ).first()
            if product_to_qbo is None:
                raise ParseError("Product not found")
            if product_to_qbo.product_series is None:
                raise ParseError("Product not have product series")
            response = update_quickbook_product_service(
                action=serializer.validated_data.get("action"),
                model=serializer.validated_data.get("model"),
                product_to_qbo=product_to_qbo,
                is_sandbox=serializer.validated_data.get("is_sandbox"),
            )
            return Response(data={"data": response}, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCreateQBOView(QuickbookCreateProduct, QuickbookUpdateProduct):
    serializer_class = CreateQuickbookProductSerializer


class ManualCreateProductQBOView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        organization_id = self.request.headers.get("organization")
        organization = Organization.objects.filter(id=organization_id).first()
        product_id = self.kwargs.get("id")
        product_to_qbo = Product.objects.filter(
            id=product_id, product_series__organization_id=organization_id
        ).first()
        if product_to_qbo is None:
            raise ParseError("Product not found")
        if product_to_qbo.product_series is None:
            raise ParseError("Product not have product series")
        response_item = {
            "id": product_id,
            "sku": product_to_qbo.sku,
            "qbo_id": None,
            "create_qbo_message": "Success",
        }
        try:
            response = create_quickbook_product_service(
                action="Create",
                model="Product",
                product_to_qbo=product_to_qbo,
                is_sandbox=organization.is_sandbox,
            )
            response_item["qbo_id"] = response.get("qbo_id")
        except Exception as e:
            response_item["create_qbo_message"] = e.detail
            return Response(
                data={
                    "data": f'Product {response_item.get("sku")} create QBO fail'
                    f', error: {response_item.get("create_qbo_message")}'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            data={
                "data": f'Product {response_item.get("sku")} create QBO success'
                f', QBO id is {response_item.get("qbo_id")}'
            },
            status=status.HTTP_200_OK,
        )


class BulkManualCreateProductQBOView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "ids",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        organization_id = self.request.headers.get("organization")
        organization = Organization.objects.filter(id=organization_id).first()
        product_ids = request.query_params.get("ids").split(",")
        list_response = []
        list_product = Product.objects.filter(
            id__in=product_ids, product_series__organization_id=organization_id
        )
        for product_id in product_ids:
            found_id = False
            for product_to_qbo in list_product:
                if int(product_id) == int(product_to_qbo.id):
                    found_id = True
                    break
            if not found_id:
                response_item = {
                    "id": product_id,
                    "sku": None,
                    "qbo_id": None,
                    "create_qbo_message": "Not found",
                }
                list_response.append(response_item)

        res = self.bulk_create_product_qbo_process(list_product, organization)
        list_response += res
        return Response(data=list_response, status=status.HTTP_200_OK)

    @async_to_sync
    async def bulk_create_product_qbo_process(self, list_products, organization):
        response = await asyncio.gather(
            *[self.create_QBO(product, organization) for product in list_products]
        )
        return response

    @sync_to_async
    def create_QBO(self, product_to_qbo, organization):
        response_item = {
            "id": product_to_qbo.id,
            "sku": product_to_qbo.sku,
            "qbo_id": None,
            "create_qbo_message": "Success",
        }
        if product_to_qbo.product_series is None:
            response_item["create_qbo_message"] = "Product not have product series"
        else:
            try:
                response = create_quickbook_product_service(
                    action="Create",
                    model="Product",
                    product_to_qbo=product_to_qbo,
                    is_sandbox=organization.is_sandbox,
                )
                response_item["qbo_id"] = response.get("qbo_id")
            except Exception as e:
                response_item["create_qbo_message"] = e.detail
        return response_item
