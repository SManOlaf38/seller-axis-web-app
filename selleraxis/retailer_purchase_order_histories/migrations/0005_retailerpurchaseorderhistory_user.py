# Generated by Django 3.2.14 on 2024-01-02 07:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        (
            "retailer_purchase_order_histories",
            "0004_alter_retailerpurchaseorderhistory_status",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="retailerpurchaseorderhistory",
            name="user",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user_order_history",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
