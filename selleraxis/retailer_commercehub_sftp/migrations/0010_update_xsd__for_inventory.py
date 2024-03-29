# Generated by Django 3.2.14 on 2023-08-16 04:49

from django.db import migrations, models
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP

DEFAULT_INVENTORY_XML_FILE_URL = "./selleraxis/retailers/services/HubXML_Inventory.xsd"


def safe_load_xml_file(file_path):
    try:
        with open(file_path, mode="r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        pass


def forwards(app, app_schema):
    RetailerCommercehubSFTP.objects.update(
        inventory_xml_format=safe_load_xml_file(DEFAULT_INVENTORY_XML_FILE_URL)
    )


class Migration(migrations.Migration):
    dependencies = [
        ("retailer_commercehub_sftp", "0009_apply_xsd_dynamic_at_cancel"),
    ]

    operations = [migrations.RunPython(forwards)]
