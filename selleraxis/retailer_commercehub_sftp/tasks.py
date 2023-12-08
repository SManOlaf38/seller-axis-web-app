import json

from asgiref.sync import async_to_sync
from django.conf import settings

from selleraxis.getting_order_histories.models import GettingOrderHistory
from selleraxis.retailer_commercehub_sftp.services import from_retailer_import_order
from selleraxis.retailers.models import Retailer

sqs_client = settings.SQS_CLIENT_TASK


@sqs_client.task(
    queue_name=settings.RETAILER_GETTING_ORDER_SQS_NAME,
    lazy=True,
    wait_time_seconds=0,
    visibility_timeout=300,
)
def retailer_getting_order(retailers, history):
    retailers = json.loads(retailers)
    history = GettingOrderHistory.objects.get(pk=history)
    for retailer_id in retailers:
        if retailer_id is not None:
            try:
                retailer = Retailer.objects.select_related(
                    "retailer_commercehub_sftp"
                ).get(pk=retailer_id, retailer_commercehub_sftp__isnull=False)
                async_to_sync(from_retailer_import_order)(
                    retailer=retailer,
                    history=history,
                )
            except Exception:
                pass
