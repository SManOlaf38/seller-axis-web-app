# Generated by Django 3.2.14 on 2023-08-02 07:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("retailer_person_places", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="retailerpersonplace",
            name="email",
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
