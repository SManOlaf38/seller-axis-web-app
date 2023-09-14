from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class ProductAliasAPIException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Invalid input body!")
    default_code = "input_body_invalid"


class UPCNumericException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("UPC codes must be numeric!")
    default_code = "upc_invalid"


class MerchantSKUException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Merchant SKU invalid!")
    default_code = "merchant_sku_invalid"


class RetailerRequiredAPIException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Product must is of retailer!")
    default_code = "retailer_required"


class ProductNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Product SKU is incorrect, please re-enter Product SKU!")
    default_code = "product_not_found"


class RetailerNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _(
        "Retailer merchant id is incorrect, please re-enter Retailer merchant id!"
    )
    default_code = "retailer_not_found"


class WarhouseNameIsNone(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Warehouse name error is Null!")
    default_code = "warehouse_name_is_none"


class ProductAliasAlreadyExists(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("In the list, the Product Alias already exists!")
    default_code = "product_alias_exists"


class WarehouseNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Warehouse not found, please create a Warehouse first!")
    default_code = "warehouse_not_found"
