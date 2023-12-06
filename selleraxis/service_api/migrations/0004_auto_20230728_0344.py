# Generated by Django 3.2.14 on 2023-07-28 03:44
from django.conf import settings
from django.db import migrations

from selleraxis.services.models import Services


def set_default_fedex_client(apps, schema_editor):
    fedex_service = Services.objects.filter(name="FEDEX").first()

    fedex_service.general_client_id = settings.DEFAULT_FEDEX_CLIENT_ID
    fedex_service.general_client_secret = settings.DEFAULT_FEDEX_CLIENT_SECRET

    fedex_service.save()


class Migration(migrations.Migration):
    dependencies = [
        ("service_api", "0003_auto_20230727_0902"),
    ]

    operations = [migrations.RunPython(set_default_fedex_client)]