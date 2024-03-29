# Generated by Django 3.2.14 on 2023-07-25 09:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("services", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ServiceAPI",
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
                ("action", models.CharField(max_length=255)),
                ("sandbox_url", models.CharField(max_length=255)),
                ("production_url", models.CharField(max_length=255)),
                ("method", models.CharField(max_length=255)),
                ("body", models.TextField()),
                ("response", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "service",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="services.services",
                    ),
                ),
            ],
        ),
    ]
