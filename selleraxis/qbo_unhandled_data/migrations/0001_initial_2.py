# Generated by Django 3.2.14 on 2023-09-27 07:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("organizations", "0009_add_qbo_token_info_2"),
    ]

    operations = [
        migrations.CreateModel(
            name="QBOUnhandledData",
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
                ("model", models.CharField(max_length=255)),
                ("action", models.CharField(max_length=255)),
                ("object_id", models.IntegerField()),
                (
                    "status",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("UNHANDLED", "UNHANDLED"),
                            ("EXISTED", "EXISTED"),
                            ("EXPIRED", "EXPIRED"),
                            ("FAIL", "FAIL"),
                        ],
                        default="UNHANDLED",
                        max_length=255,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "organization",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="organizations.organization",
                    ),
                ),
            ],
        ),
    ]