# Generated by Django 3.2.14 on 2023-08-14 10:32

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("retailer_carriers", "0003_retailercarrier_is_default"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="retailercarrier",
            name="is_default",
        ),
    ]
