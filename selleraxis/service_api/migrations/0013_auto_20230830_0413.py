# Generated by Django 3.2.14 on 2023-08-30 08:13

from django.db import migrations
from selleraxis.service_api.models import ServiceAPI
from selleraxis.services.models import Services


def set_default_ups_client(apps, schema_editor):
    ups = Services.objects.filter(name="UPS").first()
    ups_service = ServiceAPI.objects.filter(service=ups, action="SHIPPING").first()
    ups_service.response = """{
        "shipments": {
            "data": {
                "package_document": "{{ShippingLabel.GraphicImage}}",
                "tracking_number": "{{TrackingNumber}}",
                "document_type": "base64"
            },
            "field": "{{ShipmentResponse.ShipmentResults.PackageResults}}",
            "type": "list|dict"
        },
        "identification_number": "{{ShipmentResponse.ShipmentResults.ShipmentIdentificationNumber}}"
    }"""
    ups_service.save()


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0003_services_shipment_tracking_url"),
        ("service_api", "0012_auto_20230825_0630"),
    ]

    operations = [migrations.RunPython(set_default_ups_client)]
