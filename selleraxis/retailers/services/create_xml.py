import datetime
import os
import xml.etree.ElementTree as ET

import paramiko
from rest_framework import exceptions

from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP

date_now = datetime.datetime.now()


def str_time_format(date):
    if len(date) > 19:
        parsed_date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S.%f")
    else:
        parsed_date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
    transformed_date = parsed_date.strftime("%Y%m%d")
    return transformed_date


def convert_datetime_string(datetime_str):
    datetime_obj = datetime.datetime.strptime(datetime_str, "%Y-%m-%dT%H:%M:%SZ")
    converted_str = datetime_obj.strftime("%Y%m%d")
    return converted_str


def upload_xml_to_sftp(hostname, username, password, file_name, remote_file_path):
    if remote_file_path[-1] != "/":
        remote_file_path += "/"
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    ftp = ssh.open_sftp()
    try:
        ftp.chdir(remote_file_path)
    except FileNotFoundError:
        ftp.mkdir(remote_file_path)
    ftp.put(file_name, remote_file_path + str(file_name))
    ftp.close()
    ssh.close()


def inventory_commecerhub(retailer):
    try:
        retailer_sftp = RetailerCommercehubSFTP.objects.get(retailer=retailer["id"])
    except Exception as err:
        raise exceptions.ParseError(f"no SFTP info, please create SFTP: {err}")
    root = ET.Element("advice_file")
    root.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    root.set("as-of-date", str_time_format(str(date_now)))
    root.set("advice-content", "incr")
    advice_file_control_number = ET.SubElement(root, "advice_file_control_number")
    advice_file_control_number.text = str(retailer["id"])
    vendor = ET.SubElement(root, "vendor")
    vendor.text = "infibrite"
    vendorMerchID = ET.SubElement(root, "vendorMerchID")
    vendorMerchID.text = str(retailer["name"])
    if (
        retailer["retailer_products_aliases"] is None
        or len(retailer["retailer_products_aliases"]) == 0
    ):
        raise exceptions.ParseError(
            "no retailer_products_aliases info, please create retailer_products_aliases!"
        )
    for product_alias in retailer["retailer_products_aliases"]:
        product = ET.SubElement(root, "product")
        warehouse_breakout = ET.SubElement(product, "warehouseBreakout")
        next_available_date_inventory = ""
        total_qtyonhand = 0
        total_next_available = 0
        if (
            product_alias["retailer_warehouse_products"] is None
            or len(product_alias["retailer_warehouse_products"]) == 0
        ):
            raise exceptions.ParseError(
                "no retailer_warehouse_products info, please create retailer_warehouse_products!"
            )
        for retailer_warehouse_product in product_alias["retailer_warehouse_products"]:
            next_available_date_inventory = retailer_warehouse_product[
                "product_warehouse_statices"
            ]["next_available_date"]
            if (
                next_available_date_inventory is None
                or next_available_date_inventory == ""
            ):
                next_available_date_inventory = ""
            else:
                next_available_date_inventory = convert_datetime_string(
                    str(next_available_date_inventory)
                )
            total_qtyonhand += int(
                retailer_warehouse_product["product_warehouse_statices"]["qty_on_hand"]
            )
            total_next_available += int(
                retailer_warehouse_product["product_warehouse_statices"][
                    "next_available_qty"
                ]
            )
            warehouse = ET.SubElement(warehouse_breakout, "warehouse")
            warehouse.set(
                "warehouse-id",
                str(retailer_warehouse_product["retailer_warehouse"]["name"]),
            )  # must have the correct warehouse on commerce_hub

            qty_on_hand = ET.SubElement(warehouse, "qtyonhand")
            qty_on_hand.text = str(
                retailer_warehouse_product["product_warehouse_statices"]["qty_on_hand"]
            )

            next_available = ET.SubElement(warehouse, "next_available")
            next_available.set("date", next_available_date_inventory)
            next_available.set(
                "quantity",
                str(
                    retailer_warehouse_product["product_warehouse_statices"][
                        "next_available_qty"
                    ]
                ),
            )

        vendor_sku = ET.SubElement(product, "vendor_SKU")
        vendor_sku.text = str(product_alias["sku"])

        qty_on_hand = ET.SubElement(product, "qtyonhand")
        qty_on_hand.text = str(total_qtyonhand)

        upc = ET.SubElement(product, "UPC")
        upc.text = str(product_alias["product"]["upc"])

        available = ET.SubElement(product, "available")
        available.text = str(
            product_alias["product"]["available"]
        )  # YES,NO,GUARANTEED,DISCONTINUED,DELETED

        description = ET.SubElement(product, "description")
        description.text = str(product_alias["product"]["description"])

        next_available_date = ET.SubElement(product, "next_available_date")
        next_available_date.text = next_available_date_inventory

        next_available_qty = ET.SubElement(product, "next_available_qty")
        next_available_qty.text = str((total_next_available))

        merchant_sku = ET.SubElement(product, "merchantSKU")
        merchant_sku.text = str(product_alias["merchant_sku"])

    advice_file_count = ET.SubElement(root, "advice_file_count")
    advice_file_count.text = str(len(retailer["retailer_products_aliases"]))
    tree = ET.ElementTree(root)
    file_name = "{date}_{retailer}_inventory.xml".format(
        retailer=str(retailer["name"]),
        date=str_time_format(str(date_now)),
    )
    tree.write(str(file_name), encoding="UTF-8", xml_declaration=True)
    upload_xml_to_sftp(
        retailer_sftp.sftp_host,
        retailer_sftp.sftp_username,
        retailer_sftp.sftp_password,
        file_name,
        retailer_sftp.inventory_sftp_directory,
    )
    os.remove(str(file_name))
