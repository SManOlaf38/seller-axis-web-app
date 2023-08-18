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


class ShipmentConfirmationXMLSFTPUploadException(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _("Could not create Shipment Confirmation XML file to SFTP.")
    default_code = "shipment_confirmation_sftp_upload_error"


class ShipmentConfirmationS3UploadException(APIException):
    status_code = status.HTTP_406_NOT_ACCEPTABLE
    default_detail = _("Could not upload Shipment Confirmation XML file to Amazon S3.")
    default_code = "shipment_confirmation_s3_upload_error"
