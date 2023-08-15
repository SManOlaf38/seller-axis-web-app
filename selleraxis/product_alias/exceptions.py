from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class ProductAliasAPIException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Invalid input.")
    default_code = "product_alias_input_invalid"


class UPCNumericException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("UPC codes must be numeric.")
    default_code = "upc_invalid"


class MerchantSKUException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Merchant SKU length must be 9 numbers.")
    default_code = "merchant_sku_invalid"
