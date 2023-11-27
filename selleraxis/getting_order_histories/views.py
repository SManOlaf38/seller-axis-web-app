from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.pagination import Pagination
from selleraxis.core.permissions import check_permission
from selleraxis.getting_order_histories.models import GettingOrderHistory
from selleraxis.getting_order_histories.serializers import GettingOrderHistorySerializer
from selleraxis.permissions.models import Permissions


class ListGettingOrderHistoryView(ListAPIView):
    model = GettingOrderHistory
    serializer_class = GettingOrderHistorySerializer
    queryset = GettingOrderHistory.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = Pagination
    ordering_fields = ["organization", "created_at"]

    def check_permissions(self, _):
        match self.request.method:
            case "GET":
                return check_permission(self, Permissions.READ_GETTING_ORDER_HISTORY)

    def get_queryset(self):
        return self.queryset.filter(
            organization=self.request.headers.get("organization")
        )
