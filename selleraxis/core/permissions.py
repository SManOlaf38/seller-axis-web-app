from selleraxis.organization_members.models import OrganizationMember


def check_permission(context, *permissions):
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
