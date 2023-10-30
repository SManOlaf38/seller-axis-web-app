# Generated by Django 3.2.14 on 2023-10-12 04:45
import json
from datetime import datetime

from django.conf import settings
from django.db import migrations

from selleraxis.core.clients.boto3_client import sqs_client
from selleraxis.qbo_unhandled_data.models import QBOUnhandledData


def recreate_unhandled_data(apps, schema_editor):
    Retailer = apps.get_model("retailers", "Retailer")
    Product = apps.get_model("products", "Product")
    product_list = Product.objects.filter(qbo_product_id=None)
    retailer_list = Retailer.objects.filter(qbo_customer_ref_id=None)
    qbo_unhandled_data = []
    for product_item in product_list:
        if product_item.product_series is not None:
            data = QBOUnhandledData(
                model=QBOUnhandledData.Model.PRODUCT.value,
                action=QBOUnhandledData.Action.CREATE.value,
                object_id=product_item.id,
                status=QBOUnhandledData.Status.UNHANDLED.value,
                organization_id=product_item.product_series.organization.id,
            )
            qbo_unhandled_data.append(data)

    for retailer_item in retailer_list:
        data = QBOUnhandledData(
            model=QBOUnhandledData.Model.RETAILER.value,
            action=QBOUnhandledData.Action.CREATE.value,
            object_id=retailer_item.id,
            status=QBOUnhandledData.Status.UNHANDLED.value,
            organization_id=retailer_item.organization.id,
        )
        qbo_unhandled_data.append(data)
    QBOUnhandledData.objects.bulk_create(qbo_unhandled_data)


def sync_unhandled_data(apps, schema_editor):
    qbo_unhandled_data = QBOUnhandledData.objects.filter(
        organization__qbo_refresh_token_exp_time__gte=datetime.now(),
        organization__qbo_refresh_token_exp_time__isnull=False,
        status__in=[
            QBOUnhandledData.Status.UNHANDLED.value,
            QBOUnhandledData.Status.EXPIRED.value,
            QBOUnhandledData.Status.FAIL.value,
        ],
    )
    for item in qbo_unhandled_data:
        if item.model == QBOUnhandledData.Model.PRODUCT.value:
            dict_data = {
                "action": item.action,
                "model": item.model,
                "object_id": item.object_id,
            }
            message_body = json.dumps(dict_data)
            sqs_client.create_queue(
                message_body=message_body,
                queue_name=settings.CRUD_PRODUCT_SQS_NAME,
            )
        if item.model == QBOUnhandledData.Model.RETAILER.value:
            dict_data = {
                "action": item.action,
                "model": item.model,
                "object_id": item.object_id,
            }
            message_body = json.dumps(dict_data)
            sqs_client.create_queue(
                message_body=message_body,
                queue_name=settings.CRUD_RETAILER_SQS_NAME,
            )
    qbo_unhandled_data.delete()


class Migration(migrations.Migration):
    dependencies = [
        ("qbo_unhandled_data", "0006_sync_unhandled_data_3"),
    ]

    operations = [
        migrations.RunPython(recreate_unhandled_data),
        migrations.RunPython(sync_unhandled_data),
    ]
