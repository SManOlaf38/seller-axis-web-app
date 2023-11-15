# Generated by Django 3.2.14 on 2023-07-11 08:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("retailers", "0002_auto_20230706_0832"),
        ("retailer_commercehub_sftp", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="retailercommercehubsftp",
            name="retailer",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE, to="retailers.retailer"
            ),
        ),
    ]