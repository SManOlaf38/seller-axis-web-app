from django.conf import settings

from selleraxis.core.clients.boto3_client import sqs_client
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailers.models import Retailer


def send_retailer_id_sqs(list_ids):
    product_alias_list = ProductAlias.objects.filter(
        retailer_warehouse_products__product_warehouse_statices__id__in=list_ids
    )
    list_retailer = [product_alias.retailer.id for product_alias in product_alias_list]
    send_message(list_retailer)


def send_all_retailer_id_sqs():
    retailer_all = Retailer.objects.all()
    list_retailer = [retailer.id for retailer in retailer_all]
    send_message(list_retailer)


def send_message(data):
    for id in data:
        response = sqs_client.create_queue(  # noqa
            message_body=str(id),
            queue_name=settings.SQS_UPDATE_RETAILER_INVENTORY_SQS_NAME,
        )
    return None
