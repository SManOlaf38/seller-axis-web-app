# Generated by Django 3.2.14 on 2023-08-09 13:31

from django.db import migrations

from selleraxis.service_api.models import ServiceAPI, ServiceAPIAction
from selleraxis.services.models import Services, ServiceType


def create_default_ups_shipping_api(apps, schema_editor):
    services = Services.objects.filter(
        name="UPS", type=ServiceType.SHIPPING.value
    ).all()

    ups_shipping_sandbox_url = "https://wwwcie.ups.com/api/shipments/v1/ship"

    ups_shipping_production_url = "https://onlinetools.ups.com/api/shipments/v1/ship"

    ups_shipping_method = "POST"

    ups_auth_header = """{
        "Authorization": "Bearer {{access_token}}",
        "Content-Type": "application/json",
        "transId": "{{transaction_id}}",
        "transactionSrc": "{{sales_division}}"
    }"""

    ups_shipping_body = """{
        "ShipmentRequest": {
            "Request": {
                "SubVersion": "1801",
                "RequestOption": "validate",
                "TransactionReference": {
                    "CustomerContext": ""
                }
            },
            "Shipment": {
                "Description": "",
                "Shipper": {
                    "Name": "{{carrier.shipper.name}}",
                    "AttentionName": "{{carrier.shipper.attention_name}}",
                    "TaxIdentificationNumber": "{{carrier.shipper.tax_identification_number}}",
                    "Phone": {
                        "Number": "{{carrier.shipper.address}}",
                        "Extension": " "
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
                    "AttentionName": "",
                    "Phone": {
                        "Number": "{{verified_ship_to.phone}}"
                    },
                    "Address": {
                        "AddressLine": "{{verified_ship_to.address_1}}",
                        "City": "{{verified_ship_to.city}}",
                        "StateProvinceCode": "{{verified_ship_to.state}}",
                        "PostalCode": "{{verified_ship_to.postal_code}}",
                        "CountryCode": "{{verified_ship_to.country}}"
                    },
                    "Residential": ""
                },
                "ShipFrom": {
                    "Name": "T and T Designs",
                    "AttentionName": "1160b_74",
                    "Phone": {
                        "Number": "1234567890"
                    },
                    "FaxNumber": "1234567890",
                    "Address": {
                        "AddressLine": "2311 York Rd",
                        "City": "Alpharetta",
                        "StateProvinceCode": "GA",
                        "PostalCode": "30005",
                        "CountryCode": "US"
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
                    "Code": "03",
                    "Description": "Express"
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
            }
        }
    }"""

    ups_shipping_response = """{
        "shipments": {
            "data": {
                "package_document": "{{ShippingLabel.GraphicImage}}",
                "tracking_number": "{{TrackingNumber}}"
            },
            "field": "{{ShipmentResponse.ShipmentResults.PackageResults}}",
            "type": "list|dict"
        }
    }"""
    for service in services:
        ServiceAPI.objects.update_or_create(
            service=service,
            action=ServiceAPIAction.SHIPPING,
            defaults={
                "sandbox_url": ups_shipping_sandbox_url,
                "production_url": ups_shipping_production_url,
                "method": ups_shipping_method,
                "body": ups_shipping_body,
                "response": ups_shipping_response,
                "header": ups_auth_header,
            },
        )


class Migration(migrations.Migration):
    dependencies = [
        ("service_api", "0007_auto_20230808_1245"),
    ]

    operations = [migrations.RunPython(create_default_ups_shipping_api)]