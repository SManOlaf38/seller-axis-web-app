import datetime
import json

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from selleraxis.core.clients.boto3_client import sqs_client


class SQSSyncModel(models.Model):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    class Meta:
        abstract = True


@receiver(post_save)
def create_and_update_model(sender, instance, created, **kwargs):
    if sender in SQSSyncModel.__subclasses__():
        import inspect

        request = None
        for f in inspect.stack()[1:]:
            frame = f[0]
            code = frame.f_code
            if f[3] in ["get_response", "create", "update"]:
                if code.co_varnames[:1] == ("request",) or code.co_varnames[:2] == (
                    "self",
                    "request",
                ):
                    request = f[0].f_locals["request"]
                    break
        author_id = None
        if request:
            author_id = request.user.id
        object_type = instance._meta.verbose_name.title()
        object_id = instance.id
        is_sandbox = None
        if object_type.upper() == "PRODUCT":
            is_sandbox = instance.product_series.organization.is_sandbox
        elif object_type.upper() == "RETAILER":
            is_sandbox = instance.organization.is_sandbox
        trigger_type = "Update"
        if created:
            trigger_type = "Create"
        if author_id is not None:
            product_item = {
                "action": trigger_type,
                "model": object_type,
                "object_id": object_id,
                "author_id": author_id,
                "is_sandbox": is_sandbox,
            }
            queue_name = None
            if object_type.upper() == "PRODUCT":
                queue_name = settings.CRUD_PRODUCT_SQS_NAME
            elif object_type.upper() == "RETAILER":
                queue_name = settings.CRUD_RETAILER_SQS_NAME
            if queue_name:
                response = sqs_client.create_queue(  # noqa
                    message_body=json.dumps(product_item),
                    queue_name=queue_name,
                )


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


class SoftDeleteModel(models.Model):
    deleted_at = models.DateTimeField(null=True, blank=True)
    objects = SoftDeleteManager()
    all_objects = models.Manager()

    def soft_delete(self):
        self.deleted_at = datetime.datetime.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save()

    class Meta:
        abstract = True
