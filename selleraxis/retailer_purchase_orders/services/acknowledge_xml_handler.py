from datetime import datetime

from selleraxis.core.utils.common import random_chars
from selleraxis.core.utils.xsd_to_xml import XSD2XML
from selleraxis.retailer_commercehub_sftp.models import RetailerCommercehubSFTP

DEFAULT_FORMAT_DATETIME_FILE = "%Y%m%d%H%M%S"
DEFAULT_RANDOM_CHARS = "123456789"


class AcknowledgeXMLHandler(XSD2XML):
    def __init__(
        self, serializer_data: dict, sftp_config: dict = None, *args, **kwargs
    ):
        super().__init__(serializer_data, sftp_config, *args, **kwargs)
        self.commercehub_sftp: RetailerCommercehubSFTP | None = None
        self.retailer_id = None

    def set_localpath(self) -> None:
        self.localpath = "{date}_{random}_{retailer_id}_acknowledgment.xml".format(
            retailer_id=self.retailer_id,
            random=random_chars(size=6, chars=DEFAULT_RANDOM_CHARS),
            date=datetime.now().strftime(DEFAULT_FORMAT_DATETIME_FILE),
        )

    def set_remotepath(self) -> None:
        self.remotepath = self.commercehub_sftp.acknowledgment_sftp_directory

    def set_data(self) -> None:
        self.data = self.serializer_data
        self.extend_data()

    def set_schema_file(self) -> None:
        self.schema_file = "./selleraxis/retailer_purchase_orders/services/HubXML_Lowes_PO_Acknowledgement.xsd"

    def set_sftp_info(self) -> None:
        self.retailer_id = self.serializer_data["batch"]["retailer"]
        self.commercehub_sftp = RetailerCommercehubSFTP.objects.filter(
            retailer_id=self.retailer_id
        ).last()
        if self.commercehub_sftp:
            self.sftp_config = self.commercehub_sftp.__dict__

    def extend_data(self):
        self.data["ack_type"] = "initial"
        self.data["message_count"] = len(self.data["items"])
