# Generated by Django 3.2.14 on 2023-10-24 07:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("qbo_unhandled_data", "0007_sync_unhandled_data_4"),
    ]

    operations = [
        migrations.AddField(
            model_name="qbounhandleddata",
            name="is_sandbox",
            field=models.BooleanField(default=True),
        ),
    ]