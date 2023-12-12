# Generated by Django 3.2.14 on 2023-12-12 07:44

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("roles", "0019_alter_role_permissions"),
    ]

    operations = [
        migrations.AlterField(
            model_name="role",
            name="permissions",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(
                    choices=[
                        ("UPDATE_ORGANIZATION", "Update Organization"),
                        ("DELETE_ORGANIZATION", "Delete Organization"),
                        ("READ_MEMBER", "Read Member"),
                        ("INVITE_MEMBER", "Invite Member"),
                        ("REMOVE_MEMBER", "Remove Member"),
                        ("UPDATE_MEMBER", "Update Member"),
                        ("CREATE_ROLE", "Create Role"),
                        ("UPDATE_ROLE", "Update Role"),
                        ("DELETE_ROLE", "Delete Role"),
                        ("READ_ROLE", "Read Role"),
                        ("CREATE_RETAILER", "Create Retailer"),
                        ("UPDATE_RETAILER", "Update Retailer"),
                        ("DELETE_RETAILER", "Delete Retailer"),
                        ("READ_RETAILER", "Read Retailer"),
                        ("CREATE_RETAILER_PARTNER", "Create Retailer Partner"),
                        ("UPDATE_RETAILER_PARTNER", "Update Retailer Partner"),
                        ("DELETE_RETAILER_PARTNER", "Delete Retailer Partner"),
                        ("READ_RETAILER_PARTNER", "Read Retailer Partner"),
                        ("CREATE_RETAILER_ORDER_BATCH", "Create Retailer Order Batch"),
                        ("UPDATE_RETAILER_ORDER_BATCH", "Update Retailer Order Batch"),
                        ("DELETE_RETAILER_ORDER_BATCH", "Delete Retailer Order Batch"),
                        ("READ_RETAILER_ORDER_BATCH", "Read Retailer Order Batch"),
                        (
                            "CREATE_RETAILER_PARTICIPATING_PARTY",
                            "Create Retailer Participating Party",
                        ),
                        (
                            "UPDATE_RETAILER_PARTICIPATING_PARTY",
                            "Update Retailer Participating Party",
                        ),
                        (
                            "DELETE_RETAILER_PARTICIPATING_PARTY",
                            "Delete Retailer Participating Party",
                        ),
                        (
                            "READ_RETAILER_PARTICIPATING_PARTY",
                            "Read Retailer Participating Party",
                        ),
                        (
                            "CREATE_RETAILER_PERSON_PLACE",
                            "Create Retailer Person Place",
                        ),
                        (
                            "UPDATE_RETAILER_PERSON_PLACE",
                            "Update Retailer Person Place",
                        ),
                        (
                            "DELETE_RETAILER_PERSON_PLACE",
                            "Delete Retailer Person Place",
                        ),
                        ("READ_RETAILER_PERSON_PLACE", "Read Retailer Person Place"),
                        (
                            "CREATE_RETAILER_PURCHASE_ORDER",
                            "Create Retailer Purchase Order",
                        ),
                        (
                            "UPDATE_RETAILER_PURCHASE_ORDER",
                            "Update Retailer Purchase Order",
                        ),
                        (
                            "DELETE_RETAILER_PURCHASE_ORDER",
                            "Delete Retailer Purchase Order",
                        ),
                        (
                            "READ_RETAILER_PURCHASE_ORDER",
                            "Read Retailer Purchase Order",
                        ),
                        (
                            "IMPORT_RETAILER_PURCHASE_ORDER",
                            "Import Retailer Purchase Order",
                        ),
                        (
                            "CREATE_RETAILER_PURCHASE_ORDER_ITEM",
                            "Create Retailer Purchase Order Item",
                        ),
                        (
                            "UPDATE_RETAILER_PURCHASE_ORDER_ITEM",
                            "Update Retailer Purchase Order Item",
                        ),
                        (
                            "DELETE_RETAILER_PURCHASE_ORDER_ITEM",
                            "Delete Retailer Purchase Order Item",
                        ),
                        (
                            "READ_RETAILER_PURCHASE_ORDER_ITEM",
                            "Read Retailer Purchase Order Item",
                        ),
                        ("CREATE_PACKAGE_RULE", "Create Package Rule"),
                        ("UPDATE_PACKAGE_RULE", "Update Package Rule"),
                        ("DELETE_PACKAGE_RULE", "Delete Package Rule"),
                        ("READ_PACKAGE_RULE", "Read Package Rule"),
                        ("CREATE_BARCODE_SIZE", "Create Barcode Size"),
                        ("UPDATE_BARCODE_SIZE", "Update Barcode Size"),
                        ("DELETE_BARCODE_SIZE", "Delete Barcode Size"),
                        ("READ_BARCODE_SIZE", "Read Barcode Size"),
                        ("CREATE_PRODUCT", "Create Product"),
                        ("UPDATE_PRODUCT", "Update Product"),
                        ("DELETE_PRODUCT", "Delete Product"),
                        ("READ_PRODUCT", "Read Product"),
                        ("CREATE_PRODUCT_ALIAS", "Create Product Alias"),
                        ("UPDATE_PRODUCT_ALIAS", "Update Product Alias"),
                        ("DELETE_PRODUCT_ALIAS", "Delete Product Alias"),
                        ("READ_PRODUCT_ALIAS", "Read Product Alias"),
                        ("CREATE_RETAILER_WAREHOUSE", "Create Retailer Warehouse"),
                        ("UPDATE_RETAILER_WAREHOUSE", "Update Retailer Warehouse"),
                        ("DELETE_RETAILER_WAREHOUSE", "Delete Retailer Warehouse"),
                        ("READ_RETAILER_WAREHOUSE", "Read Retailer Warehouse"),
                        ("CREATE_COMMERCEHUB_SFTP", "Create Commercehub Sftp"),
                        ("UPDATE_COMMERCEHUB_SFTP", "Update Commercehub Sftp"),
                        ("DELETE_COMMERCEHUB_SFTP", "Delete Commercehub Sftp"),
                        ("READ_COMMERCEHUB_SFTP", "Read Commercehub Sftp"),
                        (
                            "CREATE_PRODUCT_WAREHOUSE_STATIC_DATA",
                            "Create Product Warehouse Static Data",
                        ),
                        (
                            "UPDATE_PRODUCT_WAREHOUSE_STATIC_DATA",
                            "Update Product Warehouse Static Data",
                        ),
                        (
                            "DELETE_PRODUCT_WAREHOUSE_STATIC_DATA",
                            "Delete Product Warehouse Static Data",
                        ),
                        (
                            "READ_PRODUCT_WAREHOUSE_STATIC_DATA",
                            "Read Product Warehouse Static Data",
                        ),
                        ("CREATE_RETAILER_CARRIER", "Create Retailer Carrier"),
                        ("UPDATE_RETAILER_CARRIER", "Update Retailer Carrier"),
                        ("DELETE_RETAILER_CARRIER", "Delete Retailer Carrier"),
                        ("READ_RETAILER_CARRIER", "Read Retailer Carrier"),
                        ("CREATE_SERVICE", "Create Service"),
                        ("UPDATE_SERVICE", "Update Service"),
                        ("DELETE_SERVICE", "Delete Service"),
                        ("READ_SERVICE", "Read Service"),
                        ("EXPORT_XML_COMMERCEHUB", "Export Xml Commercehub"),
                        ("CREATE_BOX", "Create Box"),
                        ("UPDATE_BOX", "Update Box"),
                        ("DELETE_BOX", "Delete Box"),
                        ("READ_BOX", "Read Box"),
                        ("PACKAGE_DIVIDE", "Package Divide"),
                        ("READ_ORDER_PACKAGE", "Read Order Package"),
                        ("DELETE_ORDER_PACKAGE", "Delete Order Package"),
                        ("UPDATE_ORDER_PACKAGE", "Update Order Package"),
                        ("CREATE_ORDER_PACKAGE", "Create Order Package"),
                        ("READ_ORDER_ITEM_PACKAGE", "Read Order Item Package"),
                        ("DELETE_ORDER_ITEM_PACKAGE", "Delete Order Item Package"),
                        ("UPDATE_ORDER_ITEM_PACKAGE", "Update Order Item Package"),
                        ("CREATE_ORDER_ITEM_PACKAGE", "Create Order Item Package"),
                        ("CREATE_RETAILER_SHIPPER", "Create Retailer Shipper"),
                        ("UPDATE_RETAILER_SHIPPER", "Update Retailer Shipper"),
                        ("DELETE_RETAILER_SHIPPER", "Delete Retailer Shipper"),
                        ("READ_RETAILER_SHIPPER", "Read Retailer Shipper"),
                        ("CREATE_SHIPPING", "Create Shipping"),
                        ("VALIDATE_ADDRESS", "Validate Address"),
                        ("CANCEL_SHIPMENT", "Cancel Shipment"),
                        ("CREATE_PRODUCT_SERIES", "Create Product Series"),
                        ("UPDATE_PRODUCT_SERIES", "Update Product Series"),
                        ("DELETE_PRODUCT_SERIES", "Delete Product Series"),
                        ("READ_PRODUCT_SERIES", "Read Product Series"),
                        ("READ_GS1", "Read Gs1"),
                        ("DELETE_GS1", "Delete Gs1"),
                        ("UPDATE_GS1", "Update Gs1"),
                        ("CREATE_GS1", "Create Gs1"),
                        ("READ_ADDRESS", "Read Address"),
                        ("DELETE_ADDRESS", "Delete Address"),
                        ("UPDATE_ADDRESS", "Update Address"),
                        ("CREATE_ADDRESS", "Create Address"),
                        ("READ_SERVICE_TYPE", "Read Service Type"),
                        ("DELETE_SERVICE_TYPE", "Delete Service Type"),
                        ("UPDATE_SERVICE_TYPE", "Update Service Type"),
                        ("CREATE_SERVICE_TYPE", "Create Service Type"),
                        ("READ_GETTING_ORDER_HISTORY", "Read Getting Order History"),
                        (
                            "CREATE_RETAILER_PURCHASE_ORDER_RETURN_ITEM",
                            "Create Retailer Purchase Order Return Item",
                        ),
                        (
                            "READ_RETAILER_PURCHASE_ORDER_RETURN_ITEM",
                            "Read Retailer Purchase Order Return Item",
                        ),
                        (
                            "CREATE_RETAILER_PURCHASE_ORDER_RETURN",
                            "Create Retailer Purchase Order Return",
                        ),
                        (
                            "READ_RETAILER_PURCHASE_ORDER_RETURN",
                            "Read Retailer Purchase Order Return",
                        ),
                        (
                            "CREATE_RETAILER_PURCHASE_ORDER_RETURN_NOTE",
                            "Create Retailer Purchase Order Return Note",
                        ),
                        (
                            "READ_RETAILER_PURCHASE_ORDER_RETURN_NOTE",
                            "Read Retailer Purchase Order Return Note",
                        ),
                        (
                            "UPDATE_RETAILER_PURCHASE_ORDER_RETURN_NOTE",
                            "Update Retailer Purchase Order Return Note",
                        ),
                        (
                            "DELETE_RETAILER_PURCHASE_ORDER_RETURN_NOTE",
                            "Delete Retailer Purchase Order Return Note",
                        ),
                    ],
                    max_length=255,
                ),
                size=None,
            ),
        ),
    ]
