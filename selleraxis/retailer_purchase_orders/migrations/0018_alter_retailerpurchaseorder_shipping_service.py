# Generated by Django 3.2.14 on 2023-09-21 09:02

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("retailer_purchase_orders", "0017_auto_20230905_0539"),
    ]

    operations = [
        migrations.AlterField(
            model_name="retailerpurchaseorder",
            name="shipping_service",
            field=models.CharField(max_length=255, null=True),
        ),
    ]