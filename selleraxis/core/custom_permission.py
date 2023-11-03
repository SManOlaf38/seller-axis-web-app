from django.conf import settings
from rest_framework import permissions

from selleraxis.core.exceptions import PermissionException


class CustomPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        secrets = request.headers.get("Authorization")
        if secrets != settings.LAMBDA_SECRET_KEY:
            raise PermissionException
        return True
