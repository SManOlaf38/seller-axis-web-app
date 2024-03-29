# Generated by Django 3.2.14 on 2023-09-05 09:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("retailer_carriers", "0006_retailercarrier_default_service_type"),
        ("organizations", "0008_remove_organization_gs1"),
    ]

    operations = [
        migrations.CreateModel(
            name="Address",
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
                ("company", models.CharField(blank=True, max_length=128, null=True)),
                (
                    "contact_name",
                    models.CharField(blank=True, max_length=128, null=True),
                ),
                ("address_1", models.CharField(max_length=255)),
                ("address_2", models.CharField(blank=True, max_length=255, null=True)),
                ("city", models.CharField(max_length=128)),
                ("state", models.CharField(max_length=128)),
                ("postal_code", models.CharField(max_length=128)),
                ("country", models.CharField(max_length=128)),
                ("phone", models.CharField(max_length=12)),
                ("email", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "status",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("UNVERIFIED", "UNVERIFIED"),
                            ("EDITED", "EDITED"),
                            ("VERIFIED", "VERIFIED"),
                            ("FAILED", "FAILED"),
                        ],
                        default="UNVERIFIED",
                        max_length=255,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "organization",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="organization_address",
                        to="organizations.organization",
                    ),
                ),
                (
                    "verified_carrier",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="carrier_address",
                        to="retailer_carriers.retailercarrier",
                    ),
                ),
            ],
        ),
    ]
