from django.utils.translation import gettext_lazy as _
from rest_framework import status


class GS1FullException(Exception):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("GS1 is full!")
    default_code = "gs1_full"
