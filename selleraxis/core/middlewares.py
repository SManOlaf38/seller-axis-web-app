"""
Api middleware module
"""
import logging

from django.utils.deprecation import MiddlewareMixin

from selleraxis.organizations.models import Organization
from selleraxis.settings.common import DATE_FORMAT, LOGGER_FORMAT

logging.basicConfig(format=LOGGER_FORMAT, datefmt=DATE_FORMAT)


class OrganizationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        organization_id = request.META.get("HTTP_ORGANIZATION")
        try:
            if organization_id is not None:
                organization = Organization.objects.get(pk=int(organization_id))
                if organization.sandbox_organization:
                    if organization.is_sandbox:
                        request.META["HTTP_ORGANIZATION"] = str(
                            organization.sandbox_organization.id
                        )
                else:
                    if not organization.is_sandbox:
                        request.META["HTTP_ORGANIZATION"] = str(
                            organization.prod_organization.id
                        )
        except Exception as e:
            logging.error("Error when middleware check organization id: ", e)
