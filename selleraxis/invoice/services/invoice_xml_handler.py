from datetime import datetime

from selleraxis.core.utils.common import random_chars
from selleraxis.core.utils.xsd_to_xml import XSD2XML
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP

DEFAULT_FORMAT_DATETIME_FILE = "%Y%m%d%H%M%S"
DEFAULT_RANDOM_CHARS = "123456789"
DEFAULT_XSD_LOWES_FILE_URL = "./selleraxis/invoice/services/Lowes_XML_Invoice.xsd"
DEFAULT_XSD_HOME_DEPOT_FILE_URL = (
    "./selleraxis/invoice/services/Home_Depot_XML_Invoice.xsd"
)


class InvoiceXMLHandler(XSD2XML):
    def __init__(self, data: dict, sftp_config: dict = None, *args, **kwargs):
        super().__init__(data, sftp_config, *args, **kwargs)
        self.commercehub_sftp: RetailerCommercehubSFTP | None = None
        self.retailer_id = None

    def set_localpath(self) -> None:
        self.localpath = "{upload_date}_{batch_id}_{order_id}_{retailer_id}_{rand}_invoice.xml".format(
            upload_date=datetime.now().strftime(DEFAULT_FORMAT_DATETIME_FILE),
            batch_id=self.data["batch"]["batch_number"],
            order_id=self.data["transaction_id"],
            retailer_id=self.retailer_id,
            rand=random_chars(size=6, chars=DEFAULT_RANDOM_CHARS),
        )

    def set_remotepath(self) -> None:
        if not self.commercehub_sftp.invoice_sftp_directory:
            merchant_id_data = self.clean_data["merchant_id"]
            path = f"/incoming/invoice/{merchant_id_data}"
            self.remotepath = path
        else:
            self.remotepath = self.commercehub_sftp.invoice_sftp_directory

    def set_schema_file(self) -> None:
        if self.commercehub_sftp.invoice_xml_format:
            self.schema_file = self.commercehub_sftp.invoice_xml_format
        else:
            if self.commercehub_sftp.retailer.merchant_id == "lowes":
                self.schema_file = DEFAULT_XSD_LOWES_FILE_URL
            elif self.commercehub_sftp.retailer.merchant_id == "thehomedepot":
                self.schema_file = DEFAULT_XSD_HOME_DEPOT_FILE_URL

    def set_sftp_info(self) -> None:
        self.retailer_id = self.data["batch"]["retailer"]["id"]
        self.commercehub_sftp = RetailerCommercehubSFTP.objects.filter(
            retailer_id=self.retailer_id
        ).last()
        if self.commercehub_sftp:
            self.sftp_config = self.commercehub_sftp.__dict__

    def remove_xml_file_localpath(self) -> None:
        self.xml_generator.remove()

    def set_data(self) -> None:
        all_order_packages = self.clean_data.get("order_packages", [])
        items = []
        order_packages = []
        for order_package in all_order_packages:
            shipment_packages = order_package["shipment_packages"]
            if len(shipment_packages) > 0:
                order_packages.append(order_package)
        for order_package in order_packages:
            package_id = order_package["id"]
            order_item_packages = order_package["order_item_packages"]
            for order_item_package in order_item_packages:
                item = order_item_package["retailer_purchase_order_item"]
                item["package"] = package_id
                items.append(item)

        for order_item in items:
            new_qty = 0
            for order_package in all_order_packages:
                for order_item_package in order_package.get("order_item_packages"):
                    order_item_id = order_item_package.get(
                        "retailer_purchase_order_item"
                    ).get("id")
                    if order_item.get("id") == order_item_id:
                        new_qty += order_item_package.get("quantity")
            order_item["qty_ordered"] = new_qty

        balance_due = 0
        for item in items:
            balance_due += item["qty_ordered"] * item["unit_cost"]
        balance_due = round(balance_due, 2)

        self.clean_data["order_packages"] = order_packages
        self.clean_data["message_count"] = len(items)
        self.clean_data["items"] = items
        self.clean_data["trx_balance_due"] = str(balance_due)
