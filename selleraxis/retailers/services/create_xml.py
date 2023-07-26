import datetime
import re
from random import randint

import paramiko
from django.conf import settings
from django.db import IntegrityError
from rest_framework import exceptions

from selleraxis.core.clients.boto3_client import s3_client
from selleraxis.core.utils.xml_generator import XMLGenerator
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_queue_histories.models import RetailerQueueHistory

DEFAULT_DATE_FORMAT = "%Y%m%d"
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


def inventory_commecerhub(retailer) -> None:
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
                    next_available_date = product_warehouse_statices[
                        "next_available_date"
                    ]

        product_alias["total_qty_on_hand"] = total_qty_on_hand
        product_alias["next_available_qty"] = next_available_qty
        product_alias["next_available_date"] = (
            next_available_date if next_available_date else ""
        )
        return next_available_date

    try:
        # update or create retailer queue history
        retailer_id = retailer["id"]
        queue_history_obj = RetailerQueueHistory.objects.create(
            retailer_id=retailer_id,
            type=retailer["type"],
            status=RetailerQueueHistory.Status.PENDING,
        )
    except IntegrityError:
        raise exceptions.ValidationError("Could not create retailer queue history.")

    errors = []
    try:
        retailer_sftp = RetailerCommercehubSFTP.objects.get(retailer_id=retailer_id)
        # TODO:
        # if not retailer_sftp.inventory_xml_format:
        #  please comment retailer_sftp.save()
        #  and uncomment exceptions.NotFound("XSD file not found, please create XSD.")
        #  remove xsd_template.py, it's not need to used.
        #  then frontend update UI.
        # retailer_sftp.save()
        # raise exceptions.NotFound("XSD file not found, please create XSD.")

        retailer_products_aliases = retailer["retailer_products_aliases"]
        for product_alias in retailer_products_aliases:
            process_product_alias(product_alias)

        xml_data = to_xml_data(
            retailer, advice_file_count=len(retailer_products_aliases)
        )
        xml_obj = XMLGenerator(
            schema_file="./selleraxis/retailers/services/xsd_template.xsd",
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

        # upload xml file to sftp
        upload_xml_to_sftp(
            retailer_sftp.sftp_host,
            retailer_sftp.sftp_username,
            retailer_sftp.sftp_password,
            filename,
            retailer_sftp.inventory_sftp_directory,
        )

        # upload xml file to s3
        s3_response = s3_client.upload_file(
            filename=filename, bucket=settings.BUCKET_NAME
        )
        if s3_response.ok:
            queue_history_obj.result_url = s3_response.data
            queue_history_obj.status = RetailerQueueHistory.Status.COMPLETED

        xml_obj.remove()

    except RetailerCommercehubSFTP.DoesNotExist:
        errors.append("SFTP info not found, please create SFTP.")

    except Exception as e:
        errors.append(e)

    if errors:
        queue_history_obj.status = RetailerQueueHistory.Status.FAILED
        queue_history_obj.save()
        raise exceptions.ValidationError(
            "Could not create XML file. Details: %s" % errors
        )

    queue_history_obj.save()
