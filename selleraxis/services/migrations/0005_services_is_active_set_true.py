# Generated by Django 3.2.14 on 2023-08-08 08:51

from django.db import migrations, models
from selleraxis.services.models import Services


def migrate_services(apps, schema_editor):
    Services.objects.filter(name__in=["UPS", "FEDEX"]).update(is_active=True)


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0004_services_is_active"),
    ]

    operations = [
        migrations.RunPython(migrate_services),
    ]
