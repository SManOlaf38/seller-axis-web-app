from datetime import datetime

from django.utils import timezone
from django.utils.dateparse import parse_datetime

from selleraxis.core.utils.common import random_chars
from selleraxis.core.utils.xsd_to_xml import XSD2XML
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP

DEFAULT_FORMAT_DATE = "%Y%m%d"
DEFAULT_FORMAT_DATETIME_FILE = "%Y%m%d%H%M%S"
DEFAULT_NEXT_AVAILABLE_DAYS_FORMAT_DATE = "%m%d%Y"
DEFAULT_NEXT_AVAILABLE_DAYS = 30
DEFAULT_RANDOM_CHARS = "123456789"
DEFAULT_VENDOR = "Infibrite"
DEFAULT_XSD_FILE_URL = "./selleraxis/retailers/services/HubXML_Inventory.xsd"


class InventoryXMLHandler(XSD2XML):
    def __init__(self, data: dict, sftp_config: dict = None, *args, **kwargs):
        super().__init__(data, sftp_config, *args, **kwargs)
        self.commercehub_sftp: RetailerCommercehubSFTP | None = None
        self.retailer_id = None

    def set_localpath(self) -> None:
        self.localpath = "{upload_date}_{merchant_id}_{organization_id}_{retailer_id}_{rand}_inventory.xml".format(
            upload_date=timezone.now().strftime(DEFAULT_FORMAT_DATETIME_FILE),
            merchant_id=self.clean_data["merchant_id"],
            organization_id=self.clean_data["organization"],
            retailer_id=self.retailer_id,
            rand=random_chars(size=6, chars=DEFAULT_RANDOM_CHARS),
        )

    def set_remotepath(self) -> None:
        if not self.commercehub_sftp.inventory_sftp_directory:
            merchant_id_data = self.clean_data["merchant_id"]
            path = f"/incoming/inventory/{merchant_id_data}"
            self.remotepath = path
        else:
            self.remotepath = self.commercehub_sftp.inventory_sftp_directory

    def set_schema_file(self) -> None:
        if self.commercehub_sftp.inventory_xml_format:
            self.schema_file = self.commercehub_sftp.inventory_xml_format
        else:
            self.schema_file = DEFAULT_XSD_FILE_URL

    def set_sftp_info(self) -> None:
        self.retailer_id = self.clean_data["id"]
        self.commercehub_sftp = RetailerCommercehubSFTP.objects.filter(
            retailer_id=self.retailer_id
        ).last()
        if self.commercehub_sftp:
            self.sftp_config = self.commercehub_sftp.__dict__

    def remove_xml_file_localpath(self) -> None:
        self.xml_generator.remove()

    def set_data(self) -> None:
        retailer_products_aliases = self.clean_data.get("retailer_products_aliases", [])
        for product_alias in retailer_products_aliases:
            self.process_product_alias(product_alias)

        self.clean_data["vendor"] = DEFAULT_VENDOR
        self.clean_data["advice_file_count"] = len(retailer_products_aliases)

    def process_product_alias(self, product_alias: dict) -> None:
        product = product_alias.get("product", {})
        is_live_data = product_alias.get("is_live_data", False)
        total_qty_on_hand = 0
        next_available_qty = 0
        next_available_date = None
        retailer_warehouse_products = product_alias.get(
            "retailer_warehouse_products", []
        )
        for retailer_warehouse_product in retailer_warehouse_products:
            retailer_warehouse = retailer_warehouse_product.get(
                "retailer_warehouse", {}
            )
            retailer_warehouse_product["name"] = retailer_warehouse.get(
                "name", DEFAULT_VENDOR
            )
            product_warehouse_statices = retailer_warehouse_product.get(
                "product_warehouse_statices", None
            )

            if isinstance(product_warehouse_statices, dict):
                qty_on_hand = product_warehouse_statices.get("qty_on_hand", 0)
                if is_live_data:
                    qty_on_hand = product.get("qty_on_hand", 0)
                    product_warehouse_statices["qty_on_hand"] = qty_on_hand

                total_qty_on_hand += qty_on_hand
                next_available_qty += product_warehouse_statices.get(
                    "next_available_qty", 0
                )
                next_available_date = product_warehouse_statices.get(
                    "next_available_date", None
                )
                product_warehouse_statices[
                    "next_available_date"
                ] = self.process_next_available_date(next_available_date)

        product_alias["total_qty_on_hand"] = total_qty_on_hand
        product_alias["next_available_qty"] = (
            next_available_qty if next_available_qty else None
        )
        product_alias["next_available_date"] = self.process_next_available_date(
            next_available_date
        )

        # set product available status to 'NO' then total_qty_on_hand <= 0 and status == 'YES'
        self.process_product_available(product, total_qty_on_hand)

    def process_next_available_date(self, next_available_date) -> str:
        if isinstance(next_available_date, str):
            return parse_datetime(next_available_date).strftime(DEFAULT_FORMAT_DATE)
        if isinstance(next_available_date, datetime):
            return next_available_date.strftime(DEFAULT_FORMAT_DATE)

    def process_product_available(self, product: dict, total_qty_on_hand: int = 0):
        available = product.get("available", "NO")
        if str(available).upper() == "YES" and total_qty_on_hand <= 0:
            product["available"] = "NO"
