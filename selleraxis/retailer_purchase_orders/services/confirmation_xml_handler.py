from datetime import datetime

from django.utils.dateparse import parse_datetime

from selleraxis.core.utils.common import random_chars
from selleraxis.core.utils.xsd_to_xml import XSD2XML
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP

DEFAULT_CONFIRMATION_XSD_FILE_URL = (
    "./selleraxis/retailer_purchase_orders/services/HubXML_Confirmation.xsd"
)
DEFAULT_FORMAT_DATE = "%Y%m%d"
DEFAULT_FORMAT_DATETIME_FILE = "%Y%m%d%H%M%S"
DEFAULT_RANDOM_CHARS = "123456789"


class ConfirmationXMLHandler(XSD2XML):
    def __init__(self, data: dict, sftp_config: dict = None, *args, **kwargs):
        super().__init__(data, sftp_config, *args, **kwargs)
        self.commercehub_sftp: RetailerCommercehubSFTP | None = None
        self.retailer_id = None

    def set_localpath(self) -> None:
        self.localpath = "{upload_date}_{batch_id}_{order_id}_{retailer_id}_{rand}_confirmation.xml".format(
            upload_date=datetime.now().strftime(DEFAULT_FORMAT_DATETIME_FILE),
            batch_id=self.data["batch"]["batch_number"],
            order_id=self.data["transaction_id"],
            retailer_id=self.retailer_id,
            rand=random_chars(size=6, chars=DEFAULT_RANDOM_CHARS),
        )

    def set_remotepath(self) -> None:
        if not self.commercehub_sftp.confirm_sftp_directory:
            merchant_id_data = self.clean_data["merchant_id"]
            path = f"/incoming/confirms/{merchant_id_data}"
            self.remotepath = path
        else:
            self.remotepath = self.commercehub_sftp.confirm_sftp_directory

    def set_schema_file(self) -> None:
        if self.commercehub_sftp.inventory_xml_format:
            self.schema_file = self.commercehub_sftp.confirm_xml_format
        else:
            self.schema_file = DEFAULT_CONFIRMATION_XSD_FILE_URL

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
        order_packages = self.clean_data.get("order_packages", [])
        items = []
        order_date = ship_date = self.clean_data["order_date"]
        for order_package in order_packages:
            package_id = order_package["id"]
            order_package["dimension_unit"] = str(
                order_package["dimension_unit"]
            ).upper()
            shipment_packages = order_package["shipment_packages"]
            for shipment_package in shipment_packages:
                if shipment_package["package"] == package_id:
                    order_package["shipment"] = shipment_package
                    order_package["sscc"] = shipment_package["sscc"]
                    order_package["tracking_number"] = shipment_package[
                        "tracking_number"
                    ]
                    ship_date = parse_datetime(shipment_package["created_at"]).strftime(
                        DEFAULT_FORMAT_DATE
                    )
                    order_package["ship_date"] = ship_date
                    order_package["service_level_1"] = self.clean_data[
                        "shipping_service"
                    ]["commercehub_code"]
                    break

            order_package.pop("shipment_packages")

            order_item_packages = order_package["order_item_packages"]
            for order_item_package in order_item_packages:
                item = order_item_package["retailer_purchase_order_item"]
                item["package"] = package_id
                items.append(item)

        # order date must be smaller than ship date
        if int(order_date) > int(ship_date):
            self.clean_data["order_date"] = ship_date

        self.clean_data["order_packages"] = order_packages
        self.clean_data["message_count"] = len(items)
        self.clean_data["items"] = items
