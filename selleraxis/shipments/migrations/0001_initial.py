# Generated by Django 3.2.14 on 2023-07-28 13:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("retailer_purchase_orders", "0005_auto_20230727_0822"),
        ("retailer_carriers", "0002_retailercarrier_account_number"),
    ]

    operations = [
        migrations.CreateModel(
            name="Shipment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[("CREATED", "Created"), ("CANCELED", "Canceled")],
                        max_length=128,
                    ),
                ),
                ("tracking_number", models.CharField(max_length=128)),
                ("package_document", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "carrier",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="retailer_carriers.retailercarrier",
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="shipments",
                        to="retailer_purchase_orders.retailerpurchaseorder",
                    ),
                ),
            ],
        ),
    ]
