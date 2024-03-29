# Generated by Django 3.2.14 on 2023-08-24 02:33

from django.db import migrations, models


def forwards(apps, app_schema):
    OrderVerifiedAddress = apps.get_model(
        "order_verified_address", "OrderVerifiedAddress"
    )
    OrderVerifiedAddress.objects.filter(status="ORIGIN").update(status="UNVERIFIED")


class Migration(migrations.Migration):
    dependencies = [
        ("order_verified_address", "0003_alter_orderverifiedaddress_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="orderverifiedaddress",
            name="status",
            field=models.CharField(
                choices=[
                    ("UNVERIFIED", "UNVERIFIED"),
                    ("EDITED", "EDITED"),
                    ("VERIFIED", "VERIFIED"),
                    ("FAILED", "FAILED"),
                ],
                default="UNVERIFIED",
                max_length=255,
            ),
        ),
        migrations.RunPython(forwards),
    ]
