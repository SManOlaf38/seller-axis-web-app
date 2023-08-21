from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

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
