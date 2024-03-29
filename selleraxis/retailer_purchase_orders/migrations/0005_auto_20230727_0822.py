# Generated by Django 3.2.14 on 2023-07-27 08:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("retailer_carriers", "0001_initial"),
        ("retailer_purchase_orders", "0004_remove_retailerpurchaseorder_weight"),
    ]

    operations = [
        migrations.AddField(
            model_name="retailerpurchaseorder",
            name="carrier",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="retailer_carriers.retailercarrier",
            ),
        ),
        migrations.AddField(
            model_name="retailerpurchaseorder",
            name="shipping_ref_1",
            field=models.CharField(default="", max_length=255),
        ),
        migrations.AddField(
            model_name="retailerpurchaseorder",
            name="shipping_ref_2",
            field=models.CharField(default="", max_length=255),
        ),
        migrations.AddField(
            model_name="retailerpurchaseorder",
            name="shipping_ref_3",
            field=models.CharField(default="", max_length=255),
        ),
        migrations.AddField(
            model_name="retailerpurchaseorder",
            name="shipping_ref_4",
            field=models.CharField(default="", max_length=255),
        ),
        migrations.AddField(
            model_name="retailerpurchaseorder",
            name="shipping_ref_5",
            field=models.CharField(default="", max_length=255),
        ),
        migrations.AddField(
            model_name="retailerpurchaseorder",
            name="shipping_service",
            field=models.CharField(default="", max_length=255),
        ),
    ]
