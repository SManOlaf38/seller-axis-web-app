from rest_framework.pagination import LimitOffsetPagination


class Pagination(LimitOffsetPagination):
    default_limit = 10

    def paginate_queryset(self, queryset, request, view=None):
        if request.query_params.get("limit") == "-1":
            return None
        return super().paginate_queryset(queryset, request, view)
