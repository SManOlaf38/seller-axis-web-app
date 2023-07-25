import logging
from typing import Optional

from selleraxis.core.clients.sftp_client import ClientError, CommerceHubSFTPClient
from selleraxis.core.utils.xml_generator import XMLGenerator

from .exception_utilities import ExceptionUtilities

DEFAULT_LOG_LEVEL = logging.WARNING
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
LOGGER_FORMAT = (
    "%(asctime)s.%(msecs)03d|%(name)s|%(funcName)s|%(levelname)s|%(message)s"
)
logging.basicConfig(format=LOGGER_FORMAT, datefmt=DATE_FORMAT)


class XSD2XML:
    def __init__(
        self, serializer_data: dict, sftp_config: dict = None, *args, **kwargs
    ):
        self.serializer_data = serializer_data
        self.data: Optional[dict] = {}
        self.schema_file: Optional[str] = None
        self.localpath: Optional[str] = None
        self.remotepath: Optional[str] = None
        self.xml_generator: Optional[XMLGenerator] = None
        self.sftp_config: Optional[dict] = None
        self.is_process = False

    def upload_xml_file(self, is_remove_local_file: bool = True) -> bool:
        if self.localpath and self.remotepath:
            try:
                if not isinstance(self.sftp_config, dict):
                    logging.error("sftp_config args should be a dict.")
                    return False

                sftp_client = CommerceHubSFTPClient(**self.sftp_config)
                sftp_client.connect()
                try:
                    sftp_client.put(self.localpath, self.remotepath)
                    sftp_client.close()
                    if is_remove_local_file:
                        self.xml_generator.remove()

                    return True
                except Exception as e:
                    logging.error(
                        "Failed update xml file to SFTP, localpath: '%s', remotepath: '%s'. Details: '%s'"
                        % (
                            self.localpath,
                            self.remotepath,
                            ExceptionUtilities.stack_trace_as_string(e),
                        )
                    )

            except ClientError:
                logging.error("Failed to connect SFTP")

        return False

    def process(self):
        if self.is_process is False:
            self.is_process = True
            self.parse_args()
            self.write_xml()

    def parse_args(self) -> None:
        self.set_sftp_info()
        self.set_data()
        self.set_schema_file()
        self.set_xml_generator()
        self.set_localpath()
        self.set_remotepath()

    def write_xml(self) -> None:
        if isinstance(self.xml_generator, XMLGenerator):
            try:
                self.xml_generator.generate()
                self.xml_generator.write(self.localpath)
            except Exception as e:
                logging.error(
                    "Failed write XML file. Details: '%s'"
                    % (ExceptionUtilities.stack_trace_as_string(e),)
                )

    def set_xml_generator(self) -> None:
        if self.schema_file and isinstance(self.data, dict):
            self.xml_generator = XMLGenerator(
                schema_file=self.schema_file, data=self.data, mandatory_only=True
            )

    def set_localpath(self) -> None:
        pass

    def set_remotepath(self) -> None:
        pass

    def set_data(self) -> None:
        pass

    def set_schema_file(self) -> None:
        pass

    def set_sftp_info(self) -> None:
        pass
