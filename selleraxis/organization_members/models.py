from django.db import models

from selleraxis.roles.models import Role
from selleraxis.users.models import User


class OrganizationMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, related_name="members", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
