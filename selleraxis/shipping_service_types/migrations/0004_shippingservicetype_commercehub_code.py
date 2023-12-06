# Generated by Django 3.2.14 on 2023-10-11 08:02

from django.db import migrations, models
from django.db.models import Case, When, Value, F, CharField
from selleraxis.shipping_service_types.models import ShippingServiceType


def migration_add_data_commercehub_code(apps, schema_editor):
    data = {
        "FEDEX_INTERNATIONAL_PRIORITY_EXPRESS": "FX",
        "INTERNATIONAL_FIRST": "FX",
        "FEDEX_INTERNATIONAL_PRIORITY": "FX",
        "INTERNATIONAL_ECONOMY": "FX",
        "FEDEX_GROUND": "FEDX",
        "FEDEX_CARGO_MAIL": "FX",
        "FEDEX_CARGO_INTERNATIONAL_PREMIUM": "FX",
        "FIRST_OVERNIGHT": "FX",
        "FIRST_OVERNIGHT_FREIGHT": "FX",
        "FEDEX_1_DAY_FREIGHT": "FX",
        "FEDEX_2_DAY_FREIGHT": "FX",
        "FEDEX_3_DAY_FREIGHT": "FX",
        "INTERNATIONAL_PRIORITY_FREIGHT": "FEDP",
        "INTERNATIONAL_ECONOMY_FREIGHT": "FEDF",
        "FEDEX_CARGO_AIRPORT_TO_AIRPORT": "FX",
        "INTERNATIONAL_PRIORITY_DISTRIBUTION": "FX",
        "FEDEX_IP_DIRECT_DISTRIBUTION_FREIGHT": "FX",
        "INTL_GROUND_DISTRIBUTION": "FEDX_ET",
        "GROUND_HOME_DELIVERY": "FEDH",
        "SMART_POST": "FXSP",
        "PRIORITY_OVERNIGHT": "FEDX_NM",
        "STANDARD_OVERNIGHT": "FX",
        "FEDEX_2_DAY": "FX2D",
        "FEDEX_2_DAY_AM": "FX",
        "FEDEX_EXPRESS_SAVER": "FEDX_3D",
        "SAME_DAY": "FX",
        "SAME_DAY_CITY": "FX",
        "01": "UR",
        "02": "UB",
        "03": "UG",
        "07": "UPSN",
        "08": "UPSN",
        "11": "UPSN",
        "12": "UPSN_3D",
        "13": "UPSN_PM",
        "14": "UPSN",
        "17": "UPSN",
        "54": "UPSN",
        "59": "UY",
        "65": "UPSN",
        "M2": "UPSN",
        "M3": "UPSN",
        "M4": "UPSN_FC",
        "M5": "UPSN_FC",
        "M6": "UPSN_FC",
        "M7": "UPSN_FC",
        "70": "UPSN",
        "71": "UPSN",
        "72": "UPSN",
        "74": "UPSN",
        "75": "UPSN",
        "82": "UPSN",
        "83": "UPSN",
        "84": "UPSN",
        "85": "UPSN",
        "86": "UPSN",
        "96": "UPSN",
    }

    whens = []
    for code, commercehub_code in data.items():
        whens.append(When(code=code, then=Value(commercehub_code)))
    ShippingServiceType.objects.update(
        commercehub_code=Case(*whens, output_field=CharField())
    )


class Migration(migrations.Migration):
    dependencies = [
        ("shipping_service_types", "0003_shippingservicetype_is_require_residential"),
    ]

    operations = [
        migrations.AddField(
            model_name="shippingservicetype",
            name="commercehub_code",
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.RunPython(migration_add_data_commercehub_code),
    ]