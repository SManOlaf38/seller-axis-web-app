from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView

from selleraxis.permissions.models import Permissions


class ListPermissionView(APIView):
    def get(self, _):
        return JsonResponse(
            {"permissions": [permission.value for permission in Permissions]},
            status=status.HTTP_200_OK,
        )
