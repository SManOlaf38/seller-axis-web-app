# Generated by Django 3.2.14 on 2023-08-01 07:43

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("retailer_carriers", "0002_retailercarrier_account_number"),
    ]

    operations = [
        migrations.AddField(
            model_name="retailercarrier",
            name="is_default",
            field=models.BooleanField(default=False),
        ),
    ]
