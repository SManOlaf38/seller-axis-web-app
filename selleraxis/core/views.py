from rest_framework import status
from rest_framework.exceptions import (
    MethodNotAllowed,
    ValidationError,
)
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import BulkUpdateListSerializer
from .utils import DataUtilities


class BulkUpdateAPIView(UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer(self, *args, **kwargs):
        if self.request.method in ['PUT', 'PATCH']:
            return super(BulkUpdateAPIView, self).get_serializer(
                self.get_queryset(*args, **kwargs), data=self.request.data,
                partial=kwargs.pop('partial', False), many=True)
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
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save()

    def _overwrite_meta_class(self):
        self.serializer_class.Meta.list_serializer_class = BulkUpdateListSerializer
        read_only_fields = ['id']
        if hasattr(self.serializer_class.Meta, 'read_only_fields'):
            read_only_fields += list(self.serializer_class.Meta.read_only_fields)

        self.serializer_class.Meta.read_only_fields = list(set(read_only_fields))
