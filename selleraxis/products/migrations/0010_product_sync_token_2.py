# Generated by Django 3.2.14 on 2023-09-27 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0009_product_qbo_product_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="sync_token",
            field=models.IntegerField(null=True),
        ),
    ]
