# Generated by Django 3.2.14 on 2023-08-24 14:20

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0008_auto_20230804_0728"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="qbo_product_id",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
