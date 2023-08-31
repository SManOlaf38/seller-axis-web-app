from __future__ import annotations

import logging
import os
from typing import Generator, List, TypeVar

import paramiko

T = TypeVar("T")
DEFAULT_LOG_LEVEL = logging.WARNING
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
LOGGER_FORMAT = (
    "%(asctime)s.%(msecs)03d|%(name)s|%(funcName)s|%(levelname)s|%(message)s"
)
logging.basicConfig(format=LOGGER_FORMAT, datefmt=DATE_FORMAT)


def generator(func):
    if isinstance(func, Generator):
        return [gen for gen in func]
    return func


class ClientError(BaseException):
    """Client Error"""


class FolderNotFoundError(BaseException):
    """Folder Not Found"""


class BaseClient(object):
    @property
    def logger(self) -> logging.Logger:
        return logging.getLogger(self.__class__.__name__)

    def set_log_level(self, log_level: int = DEFAULT_LOG_LEVEL) -> None:
        self.logger.setLevel(log_level)

    def safe_remove_kwargs(self, kwargs: dict, key: str):
        if key in kwargs:
            kwargs.pop(key)


class SSHClientManager(BaseClient):
    """
    SSH Client Manager
        :param str hostname: SFTP host
        :param str username: SFTP username
        :param str password: SFTP password
        :param int port: SFTP port
        :param dict config: SSH Client extra connect config.
            Read more: https://docs.paramiko.org/en/stable/api/client.html
    """  # noqa

    def __init__(
        self,
        hostname: str,
        username: str,
        password: str,
        port: int = 22,
        **extend_config,
    ):
        self._client = None
        self._hostname = hostname
        self._logger = None
        self._password = password
        self._port = port
        self._username = username
        self._extend_config = extend_config

    @property
    def client(self) -> paramiko.SSHClient | None:
        return self._client

    def connect(self) -> paramiko.SSHClient | ClientError:
        try:
            config = {
                "hostname": self._hostname,
                "username": self._username,
                "password": self._password,
                "port": self._port,
            }
            if isinstance(self._extend_config, dict):
                # Implement extend config to SSH Client.
                extend_config = {
                    "pkey": self._extend_config.get("pkey", None),
                    "key_filename": self._extend_config.get("key_filename", None),
                    "timeout": self._extend_config.get("timeout", None),
                    "allow_agent": self._extend_config.get("allow_agent", True),
                    "look_for_keys": self._extend_config.get("look_for_keys", True),
                    "compress": self._extend_config.get("compress", False),
                    "sock": self._extend_config.get("sock", None),
                    "gss_auth": self._extend_config.get("gss_auth", False),
                    "gss_kex": self._extend_config.get("gss_kex", False),
                    "gss_deleg_creds": self._extend_config.get("gss_deleg_creds", True),
                    "gss_host": self._extend_config.get("gss_host", None),
                    "banner_timeout": self._extend_config.get("banner_timeout", None),
                    "auth_timeout": self._extend_config.get("auth_timeout", None),
                    "channel_timeout": self._extend_config.get("channel_timeout", None),
                    "gss_trust_dns": self._extend_config.get("gss_trust_dns", True),
                    "passphrase": self._extend_config.get("passphrase", None),
                    "disabled_algorithms": self._extend_config.get(
                        "disabled_algorithms", None
                    ),
                    "transport_factory": self._extend_config.get(
                        "transport_factory", None
                    ),
                }
                config.update(extend_config)

            self.logger.debug("Trying to connect SSH Client.")
            self._client = paramiko.SSHClient()
            self._client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            self._client.connect(**config)
            self.logger.debug("Connect SSH Client successfully.")
            return self._client
        except paramiko.ssh_exception.AuthenticationException:
            self.logger.warning("Could not authentication SSH client.")
        except Exception as e:
            self.logger.warning("Could not connect SSH Client. Details: '%s'" % e)

        raise ClientError("Could not connect SSH client")

    def close(self) -> None:
        if isinstance(self._client, paramiko.SSHClient):
            self.client.close()

        self.logger.debug("Close SSH Client successfully.")


class SFTPClientManager(BaseClient):
    """
    SFTP Client Manager
        :param str sftp_hostname: SFTP host
        :param str sftp_username: SFTP username
        :param str sftp_password: SFTP password
        :param int sftp_port: SFTP port
        :param dict config: SSH Client extra connect config.
            Read more: https://docs.paramiko.org/en/stable/api/client.html
    """  # noqa

    def __init__(
        self,
        sftp_hostname: str,
        sftp_username: str,
        sftp_password: str,
        sftp_port: int = 22,
        **extend_config,
    ):
        self._ssh_client = SSHClientManager(
            sftp_hostname, sftp_username, sftp_password, sftp_port, **extend_config
        )
        self._client = None
        self.sftp_hostname = sftp_hostname
        self.sftp_username = sftp_username
        self.sftp_password = sftp_password
        self.sftp_port = sftp_port
        self.extend_config = extend_config

    @property
    def client(self) -> paramiko.SFTPClient | None:
        return self._client

    def connect(self) -> paramiko.SFTPClient | ClientError:
        try:
            self.logger.debug("Trying to connect SFTP Client")
            transport = paramiko.Transport((self.sftp_hostname, self.sftp_port))
            transport.connect(
                hostkey=None, username=self.sftp_username, password=self.sftp_password
            )
            self._client = paramiko.SFTPClient.from_transport(transport)
            self.logger.debug("Connect SFTP Client successfully.")
            return self._client

        except paramiko.ssh_exception.AuthenticationException:
            self.logger.warning("Could not authentication SFTP client.")

        except Exception as e:
            self.logger.warning("Could not connect SFTP Client. Details: '%s'" % e)

        raise ClientError("Could not connect SFTP client")

    def close(self) -> None:
        if isinstance(self.client, paramiko.SFTPClient):
            self._client.close()

        self.logger.debug("Close SFTP Client successfully.")

    def put(self, localpath: str, remotepath: str, callback=None, confirm=True):
        self.get_or_create_remote_path(remotepath)
        filename = os.path.basename(localpath)
        path = remotepath[:-1] if remotepath.endswith("/") else remotepath
        return self.client.put(localpath, f"{path}/{filename}", callback, confirm)

    def get_or_create_remote_path(self, remotepath: str) -> None:
        try:
            self.client.chdir(remotepath)
            return
        except FileNotFoundError:
            try:
                self.client.mkdir(remotepath)
            except PermissionError:
                raise FolderNotFoundError
        except Exception:
            raise FolderNotFoundError

    def listdir(self, remotepath) -> Generator[List[str]]:
        """lists all the files and directories in the specified path and returns them"""
        self.get_or_create_remote_path(remotepath)
        for obj in self.client.listdir(remotepath):
            yield obj

    def listdir_attr(self, remotepath) -> Generator[paramiko.SFTPAttributes]:
        """lists all the files and directories (with their attributes) in the specified path and returns them"""
        self.get_or_create_remote_path(remotepath)
        for attr in self.client.listdir_attr(remotepath):
            yield attr


class CommerceHubSFTPClient(SFTPClientManager):
    """CommerceHub SFTP Client"""

    def __init__(
        self,
        sftp_host: str,
        sftp_username: str,
        sftp_password: str,
        sftp_port: int = 22,
        purchase_orders_sftp_directory: str = None,
        acknowledgment_sftp_directory: str = None,
        confirm_sftp_directory: str = None,
        inventory_sftp_directory: str = None,
        invoice_sftp_directory: str = None,
        return_sftp_directory: str = None,
        payment_sftp_directory: str = None,
        **extend_config,
    ):
        super().__init__(
            sftp_host, sftp_username, sftp_password, sftp_port, **extend_config
        )
        self.purchase_orders_sftp_directory = purchase_orders_sftp_directory
        self.acknowledgment_sftp_directory = acknowledgment_sftp_directory
        self.confirm_sftp_directory = confirm_sftp_directory
        self.inventory_sftp_directory = inventory_sftp_directory
        self.invoice_sftp_directory = invoice_sftp_directory
        self.return_sftp_directory = return_sftp_directory
        self.payment_sftp_directory = payment_sftp_directory

    def listdir_purchase_orders(self):
        return generator(self.listdir(self.purchase_orders_sftp_directory))

    def listdir_acknowledgment(self):
        return generator(self.listdir(self.acknowledgment_sftp_directory))

    def listdir_confirm(self):
        return generator(self.listdir(self.confirm_sftp_directory))

    def listdir_inventory(self):
        return generator(self.listdir(self.inventory_sftp_directory))

    def listdir_invoice(self):
        return generator(self.listdir(self.invoice_sftp_directory))

    def listdir_return(self):
        return generator(self.listdir(self.return_sftp_directory))

    def listdir_payment(self):
        return generator(self.listdir(self.payment_sftp_directory))
