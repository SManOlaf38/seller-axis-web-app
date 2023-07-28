from django.http import JsonResponse
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions

from .models import Box
from .serializers import BoxSerializer


class ListCreateBoxView(ListCreateAPIView):
    model = Box
    serializer_class = BoxSerializer
    queryset = Box.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at", "name"]
    search_fields = ["name", "id"]

    def filter_queryset(self, queryset):
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
        return queryset

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def perform_create(self, serializer):
        return serializer.save(organization_id=self.request.headers.get("organization"))

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_BOX)
            case _:
                return check_permission(self, Permissions.CREATE_BOX)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "product_id",
                openapi.IN_QUERY,
                type=openapi.TYPE_STRING,
            ),
            # ... add more parameters as needed ...
        ]
    )
    def get(self, request, *args, **kwargs):
        list_result = []
        product_id = request.query_params.get("product_id")
        if product_id:
            list_result = self.filter_queryset(
                self.get_queryset().filter(
                    package_rules__product_series__products__id=product_id
                )
            ).distinct()
        else:
            list_result = self.filter_queryset(self.get_queryset())

        serializer = BoxSerializer(list_result, many=True)
        return JsonResponse(
            {"count": len(serializer.data), "results": serializer.data},
            status=status.HTTP_200_OK,
        )


class UpdateDeleteBoxView(RetrieveUpdateDestroyAPIView):
    model = Box
    serializer_class = BoxSerializer
    lookup_field = "id"
    queryset = Box.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_BOX)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_BOX)
            case _:
                return check_permission(self, Permissions.UPDATE_BOX)
