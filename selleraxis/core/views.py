from rest_framework import status
from rest_framework.exceptions import MethodNotAllowed, ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import GenericAPIView, ListCreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.pagination import Pagination

from .serializers import BulkUpdateListSerializer
from .utils import DataUtilities


class BaseGenericAPIView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            organization_id=self.request.headers.get("organization")
        )


class BaseListCreateAPIView(BaseGenericAPIView, ListCreateAPIView):
    pagination_class = Pagination
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ["created_at"]

    def perform_create(self, serializer):
        serializer.save(organization_id=self.request.headers.get("organization"))


class BulkUpdateAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        if self.request.method in ["PUT", "PATCH"]:
            return super(BulkUpdateAPIView, self).get_serializer(
                self.get_queryset(*args, **kwargs),
                data=self.request.data,
                partial=kwargs.pop("partial", False),
                many=True,
            )
        raise MethodNotAllowed

    def get_queryset(self, *args, **kwargs):
        object_ids = DataUtilities.from_data_to_object_ids(self.request.data)
        if len(object_ids) != len(self.request.data):
            raise ValidationError("Invalid id list found.")
        return self.queryset.filter(pk__in=object_ids)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self._overwrite_meta_class()
        serializer = self.get_serializer()
        self.validate_data(serializer)
        self.perform_update(serializer)
        return self.response(serializer=serializer)

    def response(self, serializer) -> Response:
        return Response(status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise e

    def validate_data(self, serializer):
        serializer.is_valid(raise_exception=True)

    def _overwrite_meta_class(self):
        self.serializer_class.Meta.list_serializer_class = BulkUpdateListSerializer
        read_only_fields = ["id"]
        if hasattr(self.serializer_class.Meta, "read_only_fields"):
            read_only_fields += list(self.serializer_class.Meta.read_only_fields)

        self.serializer_class.Meta.read_only_fields = list(set(read_only_fields))
