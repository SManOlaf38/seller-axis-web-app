from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class ProductIsEmptyArray(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _("The excel file is empty, Please review and correct!")
    default_code = "product_is_empty_array"
