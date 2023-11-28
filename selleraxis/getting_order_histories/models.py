from django.db import models

from selleraxis.organizations.models import Organization


class GettingOrderHistory(models.Model):
    organization = models.ForeignKey(
        Organization, related_name="getting_order_history", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
