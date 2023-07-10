from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("retailer_warehouse_products", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductWarehouseStaticData",
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
                ("status", models.CharField(max_length=255)),
                ("qty_on_hand", models.IntegerField()),
                ("next_available_quty", models.IntegerField()),
                ("next_available_date", models.DateTimeField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "product_warehouse_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="retailer_warehouse_products.retailerwarehouseproduct",
                    ),
                ),
            ],
        ),
    ]
