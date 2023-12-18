from django.core.exceptions import ObjectDoesNotExist

from selleraxis.organizations.models import Organization
from selleraxis.permissions.models import Permissions
from selleraxis.role_user.models import RoleUser


def check_permission(context, *permissions):
    if (
        Permissions.UPDATE_ORGANIZATION in permissions
        or Permissions.DELETE_ORGANIZATION in permissions
    ):
        organization = context.request.parser_context.get("kwargs").get("id")
    elif (
        Permissions.READ_MEMBER in permissions
        or Permissions.INVITE_MEMBER in permissions
        or Permissions.REMOVE_MEMBER in permissions
        or Permissions.UPDATE_MEMBER in permissions
    ):
        organization = context.request.parser_context.get("kwargs").get("org_id")
    else:
        organization = context.request.headers.get("organization", None)

    if organization is None or organization == "" or organization.isspace():
        return context.permission_denied(context.request)
    try:
        organization_obj = Organization.objects.get(id=organization)
    except ObjectDoesNotExist:
        return context.permission_denied(context.request)
    if organization_obj.sandbox_organization is None:
        organization = organization_obj.prod_organization.id

    roles = RoleUser.objects.filter(
        user__id=context.request.user.id, role__organization__id=organization
    )

    for role in roles:
        if all(permission in role.role.permissions for permission in permissions):
            return

    return context.permission_denied(
        context.request,
        f"Missing permission: {','.join(permission.value for permission in permissions)}",
    )
