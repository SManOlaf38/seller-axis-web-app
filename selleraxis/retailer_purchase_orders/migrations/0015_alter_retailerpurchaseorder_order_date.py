# Generated by Django 3.2.14 on 2023-08-28 03:31

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ("retailer_purchase_orders", "0014_alter_retailerpurchaseorder_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="retailerpurchaseorder",
            name="order_date",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]