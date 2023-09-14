from rest_framework.pagination import LimitOffsetPagination


class Pagination(LimitOffsetPagination):
    default_limit = 10

    def paginate_queryset(self, queryset, request, view=None):
        if request.query_params.get("limit") == "-1":
            self.count = queryset.count()
            self.limit = self.count
            self.offset = 0
            self.request = request
            if self.count == 0:
                return []
            return list(queryset)
        return super().paginate_queryset(queryset, request, view)
