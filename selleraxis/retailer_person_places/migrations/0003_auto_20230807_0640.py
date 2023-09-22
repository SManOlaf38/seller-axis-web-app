# Generated by Django 3.2.14 on 2023-08-07 06:40

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("retailer_person_places", "0002_alter_retailerpersonplace_email"),
    ]

    operations = [
        migrations.AddField(
            model_name="retailerpersonplace",
            name="company",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="retailerpersonplace",
            name="address_2",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]