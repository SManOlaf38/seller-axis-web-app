import datetime
import os
import re
from random import randint

import paramiko
from django.utils.dateparse import parse_datetime
from rest_framework import exceptions

from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP

from .xml_generator import XMLGenerator

DEFAULT_DATE_FORMAT = "%Y%m%d%H%M%S"
DEFAULT_DATE_FILE_FORMAT = "%Y%m%d%H%M%S"
DEFAULT_VENDOR = "Infibrite"


def str_time_format(date):
    if len(date) > 19:
        parsed_date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S.%f")
    else:
        parsed_date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
    transformed_date = parsed_date.strftime(DEFAULT_DATE_FORMAT)
    return transformed_date


def str_time_format_filename(date):
    if len(date) > 19:
        parsed_date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S.%f")
    else:
        parsed_date = datetime.datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
    transformed_date = parsed_date.strftime(DEFAULT_DATE_FILE_FORMAT)
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


def inventory_commecerhub(retailer) -> dict:
    def to_xml_data(retailer: dict, advice_file_count: int = 1) -> dict:
        return {
            "retailer": retailer,
            "vendor": DEFAULT_VENDOR,
            "advice_file_count": advice_file_count,
        }

    def process_product_alias(product_alias: dict) -> int:
        warehouse_products = product_alias.get("retailer_warehouse_products", [])
        product = product_alias.get("product", {})
        is_live_data = product.get("is_live_data", False)
        total_qty_on_hand = 0
        next_available_qty = 0
        next_available_date = None
        for warehouse_product in warehouse_products:
            retailer_warehouse = warehouse_product.get("retailer_warehouse", {})
            warehouse_product["name"] = retailer_warehouse.get("name", DEFAULT_VENDOR)
            product_warehouse_statices = warehouse_product.get(
                "product_warehouse_statices", None
            )
            if isinstance(product_warehouse_statices, dict):
                total_qty_on_hand += (
                    product.get("qty_on_hand", 0)
                    if is_live_data
                    else product_warehouse_statices.get("qty_on_hand", 0)
                )
                next_available_qty += product_warehouse_statices.get(
                    "next_available_qty", 0
                )
                next_available_date = product_warehouse_statices.get(
                    "next_available_date", 0
                )
                if next_available_date:
                    next_available_date = parse_datetime(
                        product_warehouse_statices["next_available_date"]
                    ).strftime(DEFAULT_DATE_FORMAT)

        product_alias["total_qty_on_hand"] = total_qty_on_hand
        product_alias["next_available_qty"] = next_available_qty
        product_alias["next_available_date"] = (
            next_available_date if next_available_date else ""
        )
        return next_available_date

    try:
        retailer_sftp = RetailerCommercehubSFTP.objects.get(retailer=retailer["id"])
        if not retailer_sftp.inventory_xml_format:
            raise exceptions.NotFound("XSD file not found, please create XSD.")
    except RetailerCommercehubSFTP.DoesNotExist:
        raise exceptions.NotFound("no SFTP info found, please create SFTP.")

    try:
        retailer_products_aliases = retailer.get("retailer_products_aliases")
        for product_alias in retailer_products_aliases:
            process_product_alias(product_alias)

        xml_data = to_xml_data(
            retailer, advice_file_count=len(retailer_products_aliases)
        )
        xml_obj = XMLGenerator(
            schema_file=retailer_sftp.inventory_xml_format,
            data=xml_data,
            mandatory_only=True,
        )

        xml_obj.generate()
        filename = "{date}_{random}_{retailer}_inventory.xml".format(
            retailer=re.sub(r"\W+", "", retailer.get("name"), re.MULTILINE),
            random=randint(100000, 999999),
            date=datetime.datetime.now().strftime(DEFAULT_DATE_FILE_FORMAT),
        )
        xml_obj.write(filename)

        upload_xml_to_sftp(
            retailer_sftp.sftp_host,
            retailer_sftp.sftp_username,
            retailer_sftp.sftp_password,
            filename,
            retailer_sftp.inventory_sftp_directory,
        )
        os.remove(str(filename))

    except Exception as e:
        raise exceptions.ValidationError(
            "Could not create XML file, wrong format. Details: '%s'" % e
        )
