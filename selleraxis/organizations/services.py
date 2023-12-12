from rest_framework.exceptions import ParseError

from selleraxis.organizations.models import Organization
from selleraxis.organizations.serializers import OrganizationSerializer


def update_organization_service(organization, serial_data):
    try:
        sandbox_organization = None
        prod_organization = None
        if not organization.is_sandbox:
            sandbox_organization = organization.sandbox_organization
            prod_organization = organization
        else:
            sandbox_organization = organization
            prod_organization = organization.prod_organization
        is_sandbox = serial_data.get("is_sandbox", None)

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

        if is_sandbox is not None:
            if is_sandbox:
                return OrganizationSerializer(sandbox_organization).data
            return OrganizationSerializer(prod_organization).data
        else:
            if organization.is_sandbox:
                return OrganizationSerializer(sandbox_organization).data
            return OrganizationSerializer(prod_organization).data

    except Exception as error:
        raise ParseError(error)
