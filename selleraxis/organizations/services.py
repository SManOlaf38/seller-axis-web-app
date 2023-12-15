from rest_framework.exceptions import ParseError

from selleraxis.organizations.models import Organization
from selleraxis.organizations.serializers import OrganizationSerializer


def update_organization_service(organization, serial_data):
    try:
        prod_organization = None
        sandbox_organization = organization.sandbox_organization
        if sandbox_organization is not None:
            prod_organization = organization
        else:
            sandbox_organization = organization
            prod_organization = organization.prod_organization
        serial_data.pop("is_sandbox", None)
        serial_data.pop("qbo_access_token", None)
        serial_data.pop("qbo_refresh_token", None)
        serial_data.pop("qbo_access_token_exp_time", None)
        serial_data.pop("qbo_refresh_token_exp_time", None)
        serial_data.pop("qbo_user_uuid", None)
        serial_data.pop("sandbox_organization", None)
        serial_data.pop("sandbox_organization_id", None)

        Organization.objects.filter(id=sandbox_organization.id).update(**serial_data)
        Organization.objects.filter(id=prod_organization.id).update(**serial_data)

        sandbox_organization.refresh_from_db()
        prod_organization.refresh_from_db()

        return OrganizationSerializer(prod_organization).data

    except Exception as error:
        raise ParseError(error)
