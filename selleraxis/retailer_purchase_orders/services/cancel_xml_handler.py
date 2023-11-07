from datetime import datetime

from rest_framework.exceptions import ParseError

from selleraxis.core.utils.common import random_chars
from selleraxis.core.utils.xsd_to_xml import XSD2XML
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP

DEFAULT_CONFIRMATION_XSD_FILE_URL = (
    "./selleraxis/retailer_purchase_orders/services/HubXML_Confirmation.xsd"
)
DEFAULT_FORMAT_DATE = "%Y%m%d"
DEFAULT_FORMAT_DATETIME_FILE = "%Y%m%d%H%M%S"
DEFAULT_RANDOM_CHARS = "123456789"


class CancelXMLHandler(XSD2XML):
    def __init__(self, data: dict, sftp_config: dict = None, *args, **kwargs):
        super().__init__(data, sftp_config, *args, **kwargs)
        self.commercehub_sftp: RetailerCommercehubSFTP | None = None
        self.retailer_id = None

    def set_localpath(self) -> None:
        self.localpath = "{upload_date}_{batch_id}_{order_id}_{retailer_id}_{rand}_cancel.xml".format(
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
        self.clean_data.pop("order_packages")
        if self.clean_data.get("vendor_warehouse_id") is None:
            raise ParseError("Warehouse must be not null")
