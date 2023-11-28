import asyncio
import socket

import paramiko
from asgiref.sync import sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import exceptions

from selleraxis.core.clients.sftp_client import (
    ClientError,
    CommerceHubSFTPClient,
    FolderNotFoundError,
)
from selleraxis.retailer_order_batchs.models import RetailerOrderBatch
from selleraxis.retailers.services.import_data import read_purchase_order_xml_data


def check_sftp(data):
    try:
        paths = [
            data["purchase_orders_sftp_directory"],
            data["acknowledgment_sftp_directory"],
            data["confirm_sftp_directory"],
            data["inventory_sftp_directory"],
            data["invoice_sftp_directory"],
            data["return_sftp_directory"],
            data["payment_sftp_directory"],
        ]
        # Connect to retailer's server
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(
            data["sftp_host"],
            username=data["sftp_username"],
            password=data["sftp_password"],
        )
        for path in paths:
            if path[-1] != "/":
                path += "/"
            ftp = ssh.open_sftp()
            try:
                ftp.chdir(path)
            except FileNotFoundError:
                raise exceptions.ParseError("Folder not found")
    except paramiko.AuthenticationException:
        raise exceptions.ParseError("SFTP authentication fail")
    except socket.gaierror:
        raise exceptions.ParseError("Invalid SFTP information")


async def from_retailer_import_order(
    retailer, history, retailers_sftp_client=None
) -> dict:
    sftp_client = retailers_sftp_client
    await sync_to_async(
        RetailerOrderBatch.objects.filter(retailer_id=retailer.pk).update
    )(getting_order_history=history.id)
    read_xml_cursors = []
    status_code = 201
    detail = "SUCCESSFULLY"
    try:
        if sftp_client is None:
            sftp_config = retailer.retailer_commercehub_sftp.__dict__
            sftp_client = CommerceHubSFTPClient(**sftp_config)
            sftp_client.connect()
        else:
            sftp_client.purchase_orders_sftp_directory = None

        order_batches = await sync_to_async(
            lambda: list(RetailerOrderBatch.objects.filter(retailer_id=retailer.pk))
        )()
        batch_numbers = [order_batch.batch_number for order_batch in order_batches]
        if not sftp_client.purchase_orders_sftp_directory:
            sftp_client.purchase_orders_sftp_directory = (
                f"/outgoing/orders/{retailer.merchant_id}/"
            )
        path = (
            sftp_client.purchase_orders_sftp_directory
            if sftp_client.purchase_orders_sftp_directory[-1] == "/"
            else sftp_client.purchase_orders_sftp_directory + "/"
        )

        new_order_files = {}
        for file_xml in sftp_client.listdir_purchase_orders():
            read_xml_cursors.append(
                read_purchase_order_xml_data(
                    sftp_client.client,
                    path,
                    file_xml,
                    batch_numbers,
                    retailer,
                    history,
                )
            )

            if "neworders" in file_xml:
                batch_number, *_ = file_xml.split(".")
                new_order_files[batch_number] = file_xml

        await asyncio.gather(*read_xml_cursors)
        if retailers_sftp_client is None:
            sftp_client.close()

        # update file name to Retailer Order Batch
        if new_order_files:
            for order_batch in order_batches:
                if (
                    not order_batch.file_name
                    and order_batch.batch_number in new_order_files
                ):
                    order_batch.file_name = new_order_files[order_batch.batch_number]

            await sync_to_async(
                lambda: RetailerOrderBatch.objects.bulk_update(
                    order_batches, ["file_name"]
                )
            )()
    except FolderNotFoundError:
        status_code = 404
        detail = "SFTP_FOLDER_NOT_FOUND"
        if retailers_sftp_client is None:
            sftp_client.close()

    except RetailerOrderBatch.DoesNotExist:
        status_code = 404
        detail = "RETAILER_ORDER_BATCH_DOES_NOT_EXIST"

    except ObjectDoesNotExist:
        status_code = 404
        detail = "SFTP_CONFIG_NOT_FOUND"

    except ClientError:
        status_code = 400
        detail = "SFTP_COULD_NOT_CONNECT"

    except Exception:
        status_code = 400
        detail = "FAILED"

    return {retailer.id: {"status": status_code, "detail": detail}}
