# Generated by Django 3.2.14 on 2023-09-19 03:05

from django.db import migrations
from selleraxis.service_api.models import ServiceAPI
from selleraxis.services.models import Services


def set_default_fedex_client(apps, schema_editor):
    fedex = Services.objects.filter(name="FEDEX").first()
    fedex_service = ServiceAPI.objects.filter(service=fedex, action="SHIPPING").first()
    fedex_service.body = """{
        "labelResponseOptions": "URL_ONLY",
        "requestedShipment": {
            "shipper": {
                "address": {
                    "streetLines": [
                        "{{carrier.shipper.address}}"
                    ],
                    "city": "{{carrier.shipper.city}}",
                    "stateOrProvinceCode": "{{carrier.shipper.state}}",
                    "postalCode": "{{carrier.shipper.postal_code}}",
                    "countryCode": "{{carrier.shipper.country}}"
                },
                "contact": {
                    "personName": "{{carrier.shipper.name}}",
                    "emailAddress": "{{carrier.shipper.email}}",
                    "phoneNumber": "{{carrier.shipper.phone}}",
                    "companyName": "{{carrier.shipper.company}}"
                },
                "tins": [{"number": "", "tinType": "BUSINESS_UNION", "usage": ""}]
            },
            "recipients": [
                {
                    "contact": {
                        "personName": "{{verified_ship_to.contact_name}}",
                        "emailAddress": "",
                        "phoneNumber": "{{verified_ship_to.phone}}",
                        "companyName": "{{verified_ship_to.company}}"
                    },
                    "address": {
                        "streetLines": [
                            "{{verified_ship_to.address_1}}",
                            "{{verified_ship_to.address_2}}"
                        ],
                        "city": "{{verified_ship_to.city}}",
                        "stateOrProvinceCode": "{{verified_ship_to.state}}",
                        "postalCode": "{{verified_ship_to.postal_code}}",
                        "countryCode": "{{verified_ship_to.country}}",
                        "residential": "{{shipping_service.is_require_residential}}"
                    }
                }
            ],
            "labelSpecification": {
                "imageType": "PNG",
                "labelStockType": "PAPER_4X6"
            },
            {% if not ship_date %}
              {% set formatted_ship_date =datetime.date.today().strftime("%Y-%m-%d") %}
            {% else %}
              {% set formatted_ship_date = ship_date[:10] %}
            {% endif %}
            "shipDatestamp": "{{ formatted_ship_date }}",
            "serviceType": "{{shipping_service.code}}",
            "packagingType": "YOUR_PACKAGING",
            "pickupType": "USE_SCHEDULED_PICKUP",
            "blockInsightVisibility": false,
            "edtRequestType": "NONE",
            "shippingChargesPayment": {
                "paymentType": "THIRD_PARTY",
                "payor": {
                    "responsibleParty": {
                        "address": {
                            "streetLines": ["10 FedEx Parkway", "Suite 302"],
                            "city": "Beverly Hills",
                            "stateOrProvinceCode": "CA",
                            "postalCode": "90210",
                            "countryCode": "US",
                            "residential": false
                        },
                        "accountNumber": {
                            "value": "{{carrier.account_number}}"
                        }
                    }
                }
            },
            "totalPackageCount": "{{order_packages | length}}",
            "requestedPackageLineItems": [
                {% for package in order_packages %}
                    {
                        "sequenceNumber": "{{loop.index}}",
                        "weight": {
                            "units": {% if package.weight_unit.upper() in ["LB", "LBS"] %}
                                "LB"
                            {% else %}
                                "{{package.weight_unit.upper()}}"
                            {% endif %},
                            "value": {{package.weight}}
                        },
                        "customerReferences": [
                            {
                                "customerReferenceType": "CUSTOMER_REFERENCE",
                                "value": "{{shipping_ref_1}}"
                            },
                            {
                                "customerReferenceType": "P_O_NUMBER",
                                "value": "{{shipping_ref_2}}"
                            },
                            {
                                "customerReferenceType": "INVOICE_NUMBER",
                                "value": "{{shipping_ref_3}}"
                            },
                            {
                                "customerReferenceType": "DEPARTMENT_NUMBER",
                                "value": "{{shipping_ref_4}}"
                            }
                        ],
                        "dimensions": {
                            "length": {{package.length}},
                            "width": {{package.width}},
                            "height": {{package.height}},
                            "units": "{{package.dimension_unit.upper()}}"
                        }
                    }{% if loop.index != order_packages | length %},{% endif %}
                {% endfor %}
            ]
        },
        "accountNumber": {"value": "{{carrier.account_number}}"},
        "shipAction": "CONFIRM",
        "processingOptionType": "SYNCHRONOUS_ONLY",
        "oneLabelAtATime": false
    }"""
    fedex_service.save()


class Migration(migrations.Migration):
    dependencies = [
        ("service_api", "0015_auto_20230830_0815"),
    ]

    operations = [migrations.RunPython(set_default_fedex_client)]
