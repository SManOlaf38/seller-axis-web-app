# Generated by Django 3.2.14 on 2023-03-30 09:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("retailer_purchase_orders", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="RetailerPurchaseOrderItem",
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
                ("retailer_purchase_order_item_id", models.CharField(max_length=255)),
                ("order_line_number", models.CharField(max_length=255)),
                ("merchant_line_number", models.CharField(max_length=255)),
                ("qty_ordered", models.IntegerField()),
                ("unit_of_measure", models.CharField(max_length=255)),
                ("upc", models.CharField(max_length=255)),
                ("description", models.CharField(max_length=255)),
                ("description_2", models.CharField(max_length=255)),
                ("merchant_sku", models.CharField(max_length=255)),
                ("vendor_sku", models.CharField(max_length=255)),
                ("unit_cost", models.CharField(max_length=255)),
                ("shipping_code", models.CharField(max_length=255)),
                ("expected_ship_date", models.CharField(max_length=255)),
                ("po_line_data", models.JSONField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items",
                        to="retailer_purchase_orders.retailerpurchaseorder",
                    ),
                ),
            ],
        ),
    ]