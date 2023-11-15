# Generated by Django 3.2.14 on 2023-09-19 08:56

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("addresses", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="address",
            name="classification",
            field=models.CharField(
                blank=True,
                choices=[
                    ("MIXED", "MIXED"),
                    ("UNKNOWN", "UNKNOWN"),
                    ("BUSINESS", "BUSINESS"),
                    ("RESIDENTIAL", "RESIDENTIAL"),
                ],
                default="UNKNOWN",
                max_length=255,
            ),
        ),
    ]