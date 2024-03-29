# Generated by Django 3.2.14 on 2023-07-21 08:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        (
            "product_warehouse_static_data",
            "0010_remove_productwarehousestaticdata_status",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="productwarehousestaticdata",
            name="next_available_date",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="productwarehousestaticdata",
            name="next_available_qty",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
