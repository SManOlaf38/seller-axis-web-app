from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class ProductAliasAPIException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Invalid input body!")
    default_code = "input_body_invalid"


class UPCNumericException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("UPC codes must be numeric, Please review and correct!")
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
    default_detail = _(
        "Product SKU is incorrect, please re-enter Product SKU, Please review and correct!"
    )
    default_code = "product_not_found"


class RetailerNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _(
        "Retailer merchant id is incorrect, please re-enter Retailer merchant id, Please review and correct!"
    )
    default_code = "retailer_not_found"


class WarhouseNameIsNone(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Warehouse name error is Null, Please review and correct!")
    default_code = "warehouse_name_is_none"


class ProductAliasAlreadyExists(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _(
        "In the list, the Product Alias already exists, Please review and correct!"
    )
    default_code = "product_alias_exists"


class UPCAlreadyExists(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _(
        "In the list, the UPC already exists, Please review and correct!"
    )
    default_code = "UPC_exists"


class WarehouseNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _(
        "Warehouse not found, please create a Warehouse first, Please review and correct!"
    )
    default_code = "warehouse_not_found"


class SKUQuantityException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("SKU Quantity must be numeric, Please review and correct!")
    default_code = "sku_quạntity_invalid"


class ImportMerchantSKUException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _(
        "Merchant SKU must be 9 digits and must start with 100 or 20 or 3, Please review and correct!"
    )
    default_code = "merchant_sku_invalid"


class RawDataIsEmptyArray(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("The excel file is empty, Please review and correct!")
    default_code = "ram_data_is_empty_array"
