from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class AcknowledgeXMLSFTPUploadException(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _("Could not create Acknowledge XML file to SFTP.")
    default_code = "acknowledge_sftp_upload_error"


class AcknowledgeS3UploadException(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _("Could not upload Acknowledge file to Amazon S3.")
    default_code = "acknowledge_s3_upload_error"


class AddressValidationFailed(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = _("Address validation failed!")
    default_code = "address_validation_failed"


class MissingCarrier(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _("Missing carrier")
    default_code = "missing_carrier"


class CarrierNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _("Carrier is not defined")
    default_code = "carrier_not_found"


class CarrierShipperNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _("Carrier Shipper has not been created yet")
    default_code = "carrier_shipper_not_found"


class DailyPicklistInvalidDate(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Invalid date")
    default_code = "invalid_date"


class OrganizationNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _("Organization not found!")
    default_code = "organization_not_found"


class OrderPackageNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _("Order Package has not been created yet")
    default_code = "shipping_order_package_not_found"


class ShippingServiceTypeNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = _("Shipping service type not found!")
    default_code = "shipping_service_type_not_found"


class XMLSFTPUploadException(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _("Could not create XML file to SFTP.")
    default_code = "sftp_upload_error"


class S3UploadException(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _("Could not upload XML file to Amazon S3.")
    default_code = "s3_upload_error"


class ShippingExists(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Order has been shipped!")
    default_code = "shipping_exists"


class ServiceAPIRequestFailed(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = _("Service API request failed!")
    default_code = "service_api_request_failed"


class ServiceAPILoginFailed(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = _("Login to service api failed!")
    default_code = "service_api_login_failed"


class ShipmentCancelShipped(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Cancellation is not allowed once the order has been shipped.")
    default_code = "shipment_cancel_has_been_shipped"
