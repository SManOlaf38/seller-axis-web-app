from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class BoxNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Box does not exist!")
    default_code = "box_not_found"


class PoItemNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Purchase order item does not exist!")
    default_code = "po_item_not_found"


class ProductAliasNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Not found valid product alias!")
    default_code = "po_item_not_found"


class PackageRuleNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Not found valid package rule!")
    default_code = "package_rule_not_found"


class MaxQuantytiPackageRule(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("quantity exceeds the number the box can hold!")
    default_code = "max_quantyti_package_rule"


class MaxQuantytiPoItem(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _(
        "The quantity just entered exceeds the quantity of the Purchase order item!"
    )
    default_code = "max_quantyti_po_item"
