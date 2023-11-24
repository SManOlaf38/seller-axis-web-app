from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.exceptions import APIException


class RetailerNotePermissionException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = _("Can not edit another user's note")
    default_code = "retailer_note_permission"
