from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class SFTPClientErrorException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Could not connect SFTP client")
    default_code = "sftp_client_error"


class RetailerCheckOrderFetchException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Could not fetch retailer check order")
    default_code = "retailer_check_order_fetch_error"


class InventoryXMLSFTPUploadException(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _("Could not create Inventory XML file to SFTP.")
    default_code = "inventory_xml_sftp_upload_error"


class InventoryXMLS3UploadException(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _("Could not upload Inventory XML file to Amazon S3.")
    default_code = "inventory_xml_s3_upload_error"


class ShipFromAddressNone(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("In retailers there is no ship_from_address")
    default_code = "ship_from_address_null"
