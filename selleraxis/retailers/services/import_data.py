import asyncio
from datetime import datetime

import paramiko
import xmltodict
from asgiref.sync import async_to_sync, sync_to_async
from django.utils.timezone import get_default_timezone

from selleraxis.core.utils.company_detected import from_retailer_to_company
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP
from selleraxis.retailer_order_batchs.models import RetailerOrderBatch
from selleraxis.retailer_participating_parties.models import RetailerParticipatingParty
from selleraxis.retailer_partners.models import RetailerPartner
from selleraxis.retailer_person_places.models import RetailerPersonPlace
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder
from selleraxis.retailers.models import Retailer
from selleraxis.retailers.services.dictionaries import (
    order_batch_key_dictionary,
    participating_party_key_dictionary,
    partner_key_dictionary,
    person_place_key_dictionary,
    purchase_order_item_key_dictionary,
    purchase_order_key_dictionary,
)


def convert_order_date(order_date):
    try:
        if len(str(order_date)) == 8:
            _order_date = datetime.strptime(order_date, "%Y%m%d")
            _order_date = _order_date.astimezone(get_default_timezone())
            return _order_date
    except ValueError:
        pass


async def read_purchase_order_data(data, retailer, order_batch):
    # Convert order data key
    order_dict = {}
    for key, value in data.items():
        if key in purchase_order_key_dictionary:
            order_dict[purchase_order_key_dictionary[key]] = value

    # Convert participating party data key
    participating_party_raw = order_dict.pop("participating_party")
    participating_party_dict = {}

    for key, value in participating_party_raw.items():
        if key in participating_party_key_dictionary:
            participating_party_dict[participating_party_key_dictionary[key]] = value

    # Save participating party to DB if not exist
    participating_party, _ = await sync_to_async(
        RetailerParticipatingParty.objects.update_or_create
    )(
        retailer_participating_party_id=participating_party_dict[
            "retailer_participating_party_id"
        ],
        retailer=retailer,
        defaults=participating_party_dict,
    )

    # Convert person places to list
    person_places_raw = order_dict.pop("person_place")
    if person_places_raw.__class__ != list:
        person_places_raw = [person_places_raw]

    person_places = []

    for person_place_raw in person_places_raw:
        person_place_dict = {}

        # Convert person place data key
        for key, value in person_place_raw.items():
            if key in person_place_key_dictionary and value:
                person_place_dict[person_place_key_dictionary[key]] = value

        retailer_person_place_id = person_place_dict["retailer_person_place_id"]
        person_place_dict.pop("retailer_person_place_id")  # TypeError: multiple args

        # Save person place to DB if not exist
        person_place, _ = await sync_to_async(
            RetailerPersonPlace.objects.update_or_create
        )(
            retailer_person_place_id=retailer_person_place_id,
            retailer=retailer,
            defaults=person_place_dict,
        )

        person_places.append(person_place)

    # Find order's address information
    ship_to = order_dict.pop("ship_to", None)
    bill_to = order_dict.pop("bill_to", None)
    customer = order_dict.pop("customer", None)
    invoice_to = order_dict.pop("invoice_to", None)

    ship_to_id = None
    bill_to_id = None
    customer_id = None
    invoice_to_id = None

    for person_place in person_places:
        if (
            ship_to is not None
            and person_place.retailer_person_place_id == ship_to["@personPlaceID"]
        ):
            company = from_retailer_to_company(
                merchant_id=retailer.merchant_id, name=person_place.name
            )
            if company:
                person_place.company = company
                await sync_to_async(person_place.save)()
            ship_to_id = person_place.id
        if (
            bill_to is not None
            and person_place.retailer_person_place_id == bill_to["@personPlaceID"]
        ):
            bill_to_id = person_place.id
        if (
            invoice_to is not None
            and person_place.retailer_person_place_id == invoice_to["@personPlaceID"]
        ):
            invoice_to_id = person_place.id
        if (
            customer is not None
            and person_place.retailer_person_place_id == customer["@personPlaceID"]
        ):
            customer_id = person_place.id

    order_dict["ship_to_id"] = ship_to_id
    order_dict["bill_to_id"] = bill_to_id
    order_dict["customer_id"] = customer_id
    order_dict["invoice_to_id"] = invoice_to_id

    order_dict["participating_party_id"] = participating_party.id
    order_dict["batch_id"] = order_batch.id
    if hasattr(retailer.__dict__, "default_warehouse"):
        if retailer.default_warehouse:
            order_dict["warehouse_id"] = retailer.default_warehouse.id
    else:
        if retailer.default_warehouse_id:
            order_dict["warehouse_id"] = retailer.default_warehouse_id

    items_raw = order_dict.pop("items")

    # Convert order date
    order_dict["order_date"] = convert_order_date(order_dict.get("order_date"))

    # Save order to DB if not exist
    order, _ = await sync_to_async(RetailerPurchaseOrder.objects.update_or_create)(
        retailer_purchase_order_id=order_dict["retailer_purchase_order_id"],
        batch=order_batch,
        defaults=order_dict,
    )

    if items_raw.__class__ != list:
        items_raw = [items_raw]

    create_item_cursor = []

    for item_raw in items_raw:
        item_dict = {}

        # Convert order items data key
        for key, value in item_raw.items():
            if key in purchase_order_item_key_dictionary:
                item_dict[purchase_order_item_key_dictionary[key]] = value

        item_dict["order_id"] = order.id
        # Save order items to DB if not exist
        create_item_cursor.append(
            sync_to_async(RetailerPurchaseOrderItem.objects.update_or_create)(
                retailer_purchase_order_item_id=item_dict[
                    "retailer_purchase_order_item_id"
                ],
                order=order,
                defaults=item_dict,
            )
        )

        # TODO: Subtract inventory quantity

    await asyncio.gather(*create_item_cursor, return_exceptions=True)


async def read_purchase_order_xml_data(
    ftp, path, file_xml, available_batch_numbers, retailer, order_history
):
    # Read file
    data_xml = ftp.open(path + file_xml)
    xml_content = data_xml.read()
    data_xml.close()
    data = xmltodict.parse(xml_content)
    if (
        "OrderMessageBatch" in data
        and data["OrderMessageBatch"].get("@batchNumber") not in available_batch_numbers
    ):
        # Convert order batch data key
        batch_order_dict = {}

        for key, value in data["OrderMessageBatch"].items():
            if key in order_batch_key_dictionary:
                batch_order_dict[order_batch_key_dictionary[key]] = value

        partner_raw = batch_order_dict.pop("partner")

        # Convert partner data key
        partner_dict = {}

        for key, value in partner_raw.items():
            if key in partner_key_dictionary:
                partner_dict[partner_key_dictionary[key]] = value

        # Save partner to DB if not exist
        partner_dict["retailer_id"] = retailer.id
        partner, _ = await sync_to_async(RetailerPartner.objects.update_or_create)(
            retailer_partner_id=partner_dict["retailer_partner_id"],
            retailer=retailer,
            defaults=partner_dict,
        )

        # Save order batch to DB if not exist
        order_batch, _ = await sync_to_async(
            RetailerOrderBatch.objects.update_or_create
        )(
            batch_number=batch_order_dict["batch_number"],
            retailer=retailer,
            getting_order_history=order_history,
            defaults={
                "batch_number": batch_order_dict["batch_number"],
                "partner_id": partner.id,
                "retailer_id": retailer.id,
                "file_name": file_xml,
            },
        )

        # Convert orders to list
        orders_raw = batch_order_dict.pop("orders")
        if orders_raw.__class__ != list:
            orders_raw = [orders_raw]

        # Read order data
        read_purchase_order_cursors = []

        for order_raw in orders_raw:
            read_purchase_order_cursors.append(
                read_purchase_order_data(order_raw, retailer, order_batch)
            )

        await asyncio.gather(*read_purchase_order_cursors)


@async_to_sync
async def import_purchase_order(retailer: Retailer):
    retailer_sftp = await sync_to_async(
        RetailerCommercehubSFTP.objects.filter(retailer=retailer).first
    )()
    path = (
        retailer_sftp.purchase_orders_sftp_directory
        if retailer_sftp.purchase_orders_sftp_directory[-1] == "/"
        else retailer_sftp.purchase_orders_sftp_directory + "/"
    )

    # Connect to retailer's server
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(
        retailer_sftp.sftp_host,
        username=retailer_sftp.sftp_username,
        password=retailer_sftp.sftp_password,
    )
    ftp = ssh.open_sftp()
    ftp.chdir(path)

    # Get available order batch
    available_order_batch = await sync_to_async(
        lambda: list(RetailerOrderBatch.objects.filter(retailer=retailer))
    )()
    available_batch_numbers = [
        order_batch.batch_number for order_batch in available_order_batch
    ]

    # Read XML file
    read_xml_cursors = []

    for file_xml in ftp.listdir():
        read_xml_cursors.append(
            read_purchase_order_xml_data(
                ftp, path, file_xml, available_batch_numbers, retailer
            )
        )

    await asyncio.gather(*read_xml_cursors)

    ssh.close()
