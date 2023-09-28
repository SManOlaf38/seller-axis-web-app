from django.db import models
from django.utils.translation import gettext_lazy as _

from selleraxis.organizations.models import Organization


class QBOUnhandledData(models.Model):
    class Status(models.TextChoices):
        UNHANDLED = "UNHANDLED", _("UNHANDLED")
        EXISTED = "EXISTED", _("EXISTED")
        EXPIRED = "EXPIRED", _("EXPIRED")
        FAIL = "FAIL", _("FAIL")

    class Model(models.TextChoices):
        RETAILER = "RETAILER", _("RETAILER")
        PRODUCT = "PRODUCT", _("PRODUCT")

    class Action(models.TextChoices):
        CREATE = "CREATE", _("CREATE")
        UPDATE = "UPDATE", _("UPDATE")

    model = models.CharField(max_length=255, choices=Model.choices)
    action = models.CharField(max_length=255, choices=Action.choices)
    object_id = models.IntegerField(null=False)
    status = models.CharField(
        max_length=255, default=Status.UNHANDLED, choices=Status.choices, blank=True
    )
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
