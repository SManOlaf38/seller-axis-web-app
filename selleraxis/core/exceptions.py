from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.

    if not hasattr(exc, "detail"):
        exc.detail = "error"

    if not isinstance(exc.detail, str):
        exc.detail = {
            "detail": exc.detail["detail"]
            if isinstance(exc.detail, dict) and "detail" in exc.detail
            else exc.detail
        }

    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data["status_code"] = response.status_code
        response.data["code"] = (
            exc.default_code if hasattr(exc, "default_code") else "error"
        )

    return response


class PermissionException(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = _("Miss LAMBDA_SECRET_KEY!")
    default_code = "permission_error"
