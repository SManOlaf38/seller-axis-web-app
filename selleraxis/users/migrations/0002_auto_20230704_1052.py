# Generated by Django 3.2.14 on 2023-07-04 10:52

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="avatar",
            field=models.TextField(default="SOME STRING"),
        ),
        migrations.AddField(
            model_name="user",
            name="phone",
            field=models.CharField(default="SOME STRING", max_length=30),
        ),
    ]
