# Generated by Django 3.2.14 on 2023-08-18 09:55

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("organizations", "0007_alter_organization_gs1"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="organization",
            name="gs1",
        ),
    ]
