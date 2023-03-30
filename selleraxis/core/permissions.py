from selleraxis.organization_members.models import OrganizationMember
from selleraxis.permissions.models import Permissions


def check_permission(context, *permissions):
    if (
        Permissions.UPDATE_ORGANIZATION in permissions
        or Permissions.DELETE_ORGANIZATION in permissions
    ):
        organization = context.request.parser_context.get("kwargs").get("id")
    else:
        organization = context.request.headers.get("organization", None)

    if organization is None:
        return context.permission_denied(context.request)

    roles = OrganizationMember.objects.filter(
        user__id=context.request.user.id, role__organization__id=organization
    )

    for role in roles:
        if all(permission in role.role.permissions for permission in permissions):
            return

    return context.permission_denied(
        context.request,
        f"Missing permission: {','.join(permission.value for permission in permissions)}",
    )
