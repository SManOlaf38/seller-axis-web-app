# Generated by Django 3.2.14 on 2023-08-12 03:12

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("order_verified_address", "0002_orderverifiedaddress_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="orderverifiedaddress",
            name="status",
            field=models.CharField(
                choices=[
                    ("ORIGIN", "ORIGIN"),
                    ("EDITED", "EDITED"),
                    ("VERIFIED", "VERIFIED"),
                ],
                default="ORIGIN",
                max_length=255,
            ),
        ),
    ]