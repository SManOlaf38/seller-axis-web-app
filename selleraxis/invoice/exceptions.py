from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class InvoiceInvalidException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Order has been Invoiced!")
    default_code = "invoice_invalid"


class TokenInvalidException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("token is not available!")
    default_code = "token_invalid"
