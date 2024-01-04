"""
Api middleware module
"""
import logging

from django.core.exceptions import ObjectDoesNotExist
from django.db import connection
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
                    if (
                        organization.is_sandbox
                        and "api/roles" not in request.path
                        and "api/organizations" not in request.path
                    ):
                        request.META["HTTP_ORGANIZATION"] = str(
                            organization.sandbox_organization.id
                        )
                else:
                    if (
                        not organization.is_sandbox
                        or "api/roles" in request.path
                        or "api/organizations" in request.path
                    ):
                        request.META["HTTP_ORGANIZATION"] = str(
                            organization.prod_organization.id
                        )
        except ObjectDoesNotExist:
            logging.error(f"Organization with ID {organization_id} does not exist.")
        except Exception as e:
            logging.error(f"Error when middleware check organization id: {str(e)}")


class QueryAlertMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        total_queries = len(connection.queries)
        if request.method == "GET":
            max_queries = 100
        else:
            max_queries = 20

        if total_queries > max_queries:
            api_path = request.path_info
            api_method = request.method
            api_name = f"{api_method} {api_path}"
            logging.warning(
                f"Alert: Number of queries ({total_queries}) for API {api_name}"
            )

        return response
