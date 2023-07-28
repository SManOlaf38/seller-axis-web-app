import logging
from typing import Any, Optional, Tuple

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
        self,
        data: dict,
        schema_file: str = None,
        localpath: str = None,
        remotepath: str = None,
        sftp_config: dict = None,
        *args,
        **kwargs
    ):
        self.data: Optional[dict] = data
        self.schema_file: Optional[str] = schema_file
        self.localpath: Optional[str] = localpath
        self.remotepath: Optional[str] = remotepath
        self.xml_generator: Optional[XMLGenerator] = None
        self.sftp_config: Optional[dict] = None
        self.is_process = False

    def upload_xml_file(self, is_remove_local_file: bool = True) -> Tuple[Any, bool]:
        if self.is_process is False:
            self.process()

        if self.localpath and self.remotepath:
            try:
                if not isinstance(self.sftp_config, dict):
                    logging.error("sftp_config args should be a dict.")
                    return None, False

                self.write_xml()
                sftp_client = CommerceHubSFTPClient(**self.sftp_config)
                sftp_client.connect()
                try:
                    file = sftp_client.put(self.localpath, self.remotepath)
                    sftp_client.close()
                    if is_remove_local_file:
                        self.xml_generator.remove()

                    if file:
                        return file, True
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

        return None, False

    def process(self):
        self.is_process = True
        self.parse_args()

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
