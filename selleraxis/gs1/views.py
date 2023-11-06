from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import (
    DestroyAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response

from ..core.permissions import check_permission
from ..permissions.models import Permissions
from .models import GS1
from .serializers import GS1Serializer


class ListCreateGS1View(ListCreateAPIView):
    serializer_class = GS1Serializer
    queryset = GS1.objects.all()
    search_fields = ["series"]
    ordering_fields = ["id", "created_at"]

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.headers.get("organization"))

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_GS1)
            case _:
                return check_permission(self, Permissions.CREATE_GS1)


class UpdateDeleteGS1View(RetrieveUpdateDestroyAPIView):
    serializer_class = GS1Serializer
    queryset = GS1.objects.all()

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_GS1)
            case "DELETE":
                return check_permission(self, Permissions.DELETE_GS1)
            case _:
                return check_permission(self, Permissions.UPDATE_GS1)


class BulkGS1View(DestroyAPIView):
    model = GS1
    lookup_field = "id"
    queryset = GS1.objects.all()

    def check_permissions(self, _):
        return check_permission(self, Permissions.DELETE_GS1)

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
        organization_id = self.request.headers.get("organization")
        ids = request.query_params.get("ids")
        GS1.objects.filter(id__in=ids.split(","), organization=organization_id).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
