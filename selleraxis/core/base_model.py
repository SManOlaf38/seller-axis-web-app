import json

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from selleraxis.core.clients.boto3_client import sqs_client


class BaseModel(models.Model):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    class Meta:
        abstract = True


@receiver(post_save)
def create_and_update_model(sender, instance, created, **kwargs):
    if sender in BaseModel.__subclasses__():

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
        trigger_type = "Update"
        if created:
            trigger_type = "Create"
        product_item = {
            "action": trigger_type,
            "model": object_type,
            "object_id": object_id,
            "author_id": author_id,
        }
        print("product_item ", product_item)
        response = sqs_client.create_queue(  # noqa
            message_body=json.dumps(product_item),
            queue_name=settings.CRUD_PRODUCT_SQS_NAME,
        )
