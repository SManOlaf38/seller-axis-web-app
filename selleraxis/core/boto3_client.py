from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from traceback import TracebackException
from typing import TYPE_CHECKING, Optional

import boto3
from botocore.exceptions import ParamValidationError

if TYPE_CHECKING:
    from botocore.client import Config

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
LOGGER_FORMAT = (
    "%(asctime)s.%(msecs)03d|%(name)s|%(funcName)s|%(levelname)s|%(message)s"
)
logging.basicConfig(format=LOGGER_FORMAT, datefmt=DATE_FORMAT)


@dataclass(kw_only=True)
class Configuration:
    service_name: Optional[str] = os.getenv("SQS_CLIENT_SERVICE_NAME", "sqs")
    region_name: Optional[str] = os.getenv("SQS_CLIENT_REGION_NAME", "us-east-1")
    api_version: Optional[str] = None
    use_ssl: bool = True
    verify: Optional[bool | str] = False
    endpoint_url: Optional[str] = None
    aws_access_key_id: Optional[str] = os.getenv(
        "SQS_CLIENT_AWS_ACCESS_KEY_ID", "AKIA3JN6HHOXO4IOEZ7T"
    )
    aws_secret_access_key: Optional[str] = os.getenv(
        "AWS_SECRET_ACCESS_KEY", "aDFR1YvXktXa4kCkOVO4ugA+Bo5oEh4Nk9KVXmlz"
    )
    aws_session_token: Optional[str] = None
    config: Config = None


class Boto3Client(object):
    _DEFAULT_LOG_LEVEL = logging.WARNING
    _instance = None
    _clients = {}

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(Boto3Client, cls).__new__(cls)
        return cls._instance

    def __init__(self, config: Configuration = None, logger: logging.Logger = None):
        self.initialize(config or Configuration())
        self._logger = logger

    @classmethod
    def initialize(cls, config: Configuration):
        if config.service_name not in cls._clients:
            cls._clients[config.service_name] = boto3.client(
                service_name=config.service_name,
                region_name=config.region_name,
                api_version=config.api_version,
                use_ssl=config.use_ssl,
                verify=config.verify,
                endpoint_url=config.endpoint_url,
                aws_access_key_id=config.aws_access_key_id,
                aws_secret_access_key=config.aws_secret_access_key,
                aws_session_token=config.aws_session_token,
                config=config.aws_session_token,
            )
        return cls._clients[config.service_name]

    @property
    def logger(self):
        if self._logger is None:
            self._logger = logging.getLogger(self.__class__.__name__)
            self._logger.setLevel(Boto3Client._DEFAULT_LOG_LEVEL)
        return self._logger


class SQSClient(Boto3Client):
    _SERVICE_NAME = "sqs"

    @property
    def client(self):
        return super(SQSClient, self).initialize(
            Configuration(service_name=SQSClient._SERVICE_NAME)
        )

    def send(self, queue_name: str, message_body: str) -> bool | dict:
        try:
            queue_url_response = self.client.get_queue_url(QueueName=queue_name)
            queue_url = queue_url_response.get("QueueUrl", None)
            if queue_url:
                response = self.client.send_message(
                    QueueUrl=queue_url, MessageBody=message_body
                )
                return response
        except ParamValidationError:
            self.logger.error(
                "Failed to send sqs queue, queue name '%s', message body: '%s'. Details: ParamValidationError"
                % (queue_name, message_body)
            )
        except Exception as e:
            self.logger.error(
                "Failed to send sqs queue, queue name '%s', message body: '%s'. Details: '%s'",
                queue_name,
                message_body,
                "".join(TracebackException.from_exception(e).format()),
            )
