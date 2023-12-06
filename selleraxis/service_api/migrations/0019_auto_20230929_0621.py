# Generated by Django 3.2.14 on 2023-09-29 10:21

from django.db import migrations
from selleraxis.service_api.models import ServiceAPI
from selleraxis.services.models import Services


def set_default_ups_client(apps, schema_editor):
    ups = Services.objects.filter(name="UPS").first()
    ups_service = ServiceAPI.objects.filter(service=ups, action="SHIPPING").first()
    ups_service.body = """{
        "ShipmentRequest": {
            "Request": {
                "SubVersion": "1801",
                "RequestOption": "nonvalidate",
                "TransactionReference": {
                    "CustomerContext": ""
                }
            },
            "Shipment": {
                "Description": "Infibrite Shipment",
                "Shipper": {
                    "Name": "{{carrier.shipper.name}}",
                    "AttentionName": "{{carrier.shipper.attention_name}}",
                    "TaxIdentificationNumber": "{{carrier.shipper.tax_identification_number}}",
                    "Phone": {
                        "Number": "{{carrier.shipper.phone}}",
                        "Extension": ""
                    },
                    "ShipperNumber": "{{carrier.shipper.shipper_number}}",
                    "FaxNumber": "{{carrier.shipper.fax_number}}",
                    "Address": {
                        "AddressLine": "{{carrier.shipper.address}}",
                        "City": "{{carrier.shipper.city}}",
                        "StateProvinceCode": "{{carrier.shipper.state}}",
                        "PostalCode": "{{carrier.shipper.postal_code}}",
                        "CountryCode": "{{carrier.shipper.country}}"
                    }
                },
                "ShipTo": {
                    "Name": "{{verified_ship_to.contact_name}}",
                    "AttentionName": "{{verified_ship_to.contact_name}}",
                    "Phone": {
                        "Number": "{{verified_ship_to.phone}}"
                    },
                    "Address": {
                        "AddressLine": [
                            "{{verified_ship_to.address_1}}"{% if verified_ship_to.address_2 %}, "{{verified_ship_to.address_2}}"{% endif %}
                        ],
                        "City": "{{verified_ship_to.city}}",
                        "StateProvinceCode": "{{verified_ship_to.state}}",
                        "PostalCode": "{{verified_ship_to.postal_code}}",
                        "CountryCode": "{{verified_ship_to.country}}"
                    },
                    "Residential": ""
                },
                "ShipFrom": {
                    "Name": "{{ship_from.contact_name}}",
                    "AttentionName": "",
                    "Phone": {
                        "Number": "{{ship_from.phone}}"
                    },
                    "FaxNumber": "",
                    "Address": {
                        "AddressLine": [
                            "{{ship_from.address_1}}"{% if ship_from.address_2 %}, "{{ship_from.address_2}}"{% endif %}
                        ],
                        "City": "{{ship_from.city}}",
                        "StateProvinceCode": "{{ship_from.state}}",
                        "PostalCode": "{{ship_from.postal_code}}",
                        "CountryCode": "{{ship_from.country}}"
                    }
                },
                "PaymentInformation": {
                    "ShipmentCharge": {
                        "Type": "01",
                        "BillShipper": {
                            "AccountNumber": "{{carrier.account_number}}"
                        }
                    }
                },
                "Service": {
                    "Code": "{{shipping_service.code}}",
                    "Description": ""
                },
                "Package": [
                {% for package in order_packages %}
                    {
                        "Description": "",
                        "Packaging": {
                            "Code": "02",
                            "Description": ""
                        },
                        "Dimensions": {
                            "UnitOfMeasurement": {
                                "Code": "{{package.dimension_unit.upper()}}",
                                "Description": "{{package.dimension_unit.upper()}}"
                            },
                            "Length": "{{package.length}}",
                            "Width": "{{package.width}}",
                            "Height": "{{package.height}}"
                        },
                        "PackageWeight": {
                            "UnitOfMeasurement": {
                                "Code": "{% if package.weight_unit.upper() in ["LB", "LBS"] %}LBS{% else %}{{package.weight_unit.upper()}}{% endif %}",
                                "Description": ""
                            },
                            "Weight": "{{package.weight}}"
                        }
                    }{% if loop.index != order_packages | length %},{% endif %}
                {% endfor %}
                ]
            },
            "LabelSpecification": {
                "LabelImageFormat": {
                    "Code": "GIF",
                    "Description": "GIF"
                },
                "HTTPUserAgent": "Mozilla/4.5"
            },
            "ReferenceNumber": [
                {
                    "Code": "{{shipping_ref_1_code}}",
                    "Value": "{{shipping_ref_1}}"
                },
                {
                    "Code": "{{shipping_ref_2_code}}",
                    "Value": "{{shipping_ref_2}}"
                },
                {
                    "Code": "{{shipping_ref_3_code}}",
                    "Value": "{{shipping_ref_3}}"
                },
                {
                    "Code": "{{shipping_ref_4_code}}",
                    "Value": "{{shipping_ref_4}}"
                }
            ]
        }
    }"""
    ups_service.save()


class Migration(migrations.Migration):
    dependencies = [
        ("service_api", "0018_auto_20230922_0416"),
    ]

    operations = [migrations.RunPython(set_default_ups_client)]