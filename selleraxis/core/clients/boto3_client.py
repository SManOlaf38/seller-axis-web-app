from __future__ import annotations

import logging
import os
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any, List, Optional, TypeVar

import boto3
from botocore.exceptions import (
    ClientError,
    ParamValidationError,
    UnknownRegionError,
    UnknownServiceError,
)

from ..utils.exception_utilities import ExceptionUtilities

if TYPE_CHECKING:
    from botocore.client import Config

T = TypeVar("T")
DEFAULT_LOG_LEVEL = logging.DEBUG
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
LOGGER_FORMAT = (
    "%(asctime)s.%(msecs)03d|%(name)s|%(funcName)s|%(levelname)s|%(message)s"
)
logging.basicConfig(format=LOGGER_FORMAT, datefmt=DATE_FORMAT)

__all__ = [
    "Configuration",
    "Boto3ClientManager",
    "SQSClient",
    "ClientCreateError",
    "sqs_client",
    "s3_client",
]


class ClientCreateError(BaseException):
    """Could not create client
    TODO:
        import Boto3ClientManager, Configuration
        Boto3ClientManager.initialize(Configuration(**kwargs))
    USAGE:
        import sqs_client
        response = sqs_client.create_queue(queue_name, message_body)
    """


@dataclass
class Configuration:
    service_name: Optional[str] = None
    region_name: Optional[str] = os.getenv("AWS_DEFAULT_REGION", None)
    api_version: Optional[str] = None
    use_ssl: bool = True
    verify: Optional[bool | str] = False
    endpoint_url: Optional[str] = None
    aws_access_key_id: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID", None)
    aws_secret_access_key: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY", None)
    aws_session_token: Optional[str] = os.getenv("AWS_SESSION_TOKEN", None)
    config: Config = os.getenv("BOTO_CONFIG", None)


@dataclass
class Error:
    errors: Optional[str] = "Failed to create task"
    traceback: Optional[str] = None


@dataclass
class Response:
    data: Any = field(default_factory=dict)
    status_code: int = 201
    ok: bool = True


class Boto3ClientManager(object):
    _clients = {}

    @classmethod
    def initialize(cls, config: Configuration) -> None:
        if config.service_name in cls._clients:
            logging.error(
                f"Client service has been initialized before, client service {config.service_name}"
            )
        else:
            try:
                client = cls.create_client(config=config)
                cls._clients[config.service_name] = client
            except ClientCreateError:
                logging.warning(ClientCreateError.__doc__)

    @classmethod
    def multiple_initialize(cls, configs: List[Configuration]) -> None:
        for config in configs:
            cls.initialize(config)

    @classmethod
    def get(cls, service_name: str) -> T:
        return cls._clients.get(service_name, None)

    @classmethod
    def list_client(cls):
        return cls._clients.values()

    @classmethod
    def create_client(cls, config: Configuration) -> T | ClientCreateError:
        try:
            client = boto3.client(
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

            return client

        except UnknownServiceError:
            logging.error(
                f"Failed to initialize client service: {config.service_name}. Details: Unknown service."
            )
        except UnknownRegionError:
            logging.error(
                f"Failed to initialize client service: {config.service_name}. Details: Unknown region."
            )
        except Exception:
            logging.error(f"Failed to initialize client service: {config.service_name}")

        raise ClientCreateError


class Boto3Client(object):
    _SERVICE_NAME = None
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(Boto3Client, cls).__new__(cls)
        return cls._instance

    def __init__(self, config: Configuration = None):
        self._config = config or Configuration()
        self._client = Boto3ClientManager.get(self.__class__._SERVICE_NAME)
        self._logger = None

    @property
    def client(self) -> T:
        self._config.service_name = self.__class__._SERVICE_NAME
        if self._client is None:
            self._client = Boto3ClientManager.get(self.__class__._SERVICE_NAME)
        return self._client

    def initialize(self, config: Configuration) -> T:
        self._config.service_name = self.__class__.__name__
        Boto3ClientManager.initialize(config)
        return Boto3ClientManager.get(self.__class__.__name__)

    @property
    def logger(self) -> logging.Logger:
        if not isinstance(self._logger, logging.Logger):
            self._logger = logging.getLogger(self.__class__.__name__)
            self._logger.setLevel(DEFAULT_LOG_LEVEL)
        return self._logger

    def set_log_level(self, log_level: int = DEFAULT_LOG_LEVEL) -> None:
        self.logger.setLevel(log_level)

    def safe_remove_kwargs(self, kwargs: dict, key: str):
        if key in kwargs:
            kwargs.pop(key)


class SQSClient(Boto3Client):
    """Implements a Singleton Boto3 SQS Client"""

    _SERVICE_NAME = "sqs"

    def create_queue(
        self,
        message_body: str,
        queue_url: str = None,
        queue_name: str = None,
        *args,
        **kwargs,
    ) -> Response:
        """Create the sqs queue"""
        try:
            if not queue_url and queue_name:
                queue_url = self.get_queue_url(queue_name)

            if queue_url:
                self.safe_remove_kwargs(kwargs, "QueueUrl")
                self.safe_remove_kwargs(kwargs, "QueueName")
                self.safe_remove_kwargs(kwargs, "MessageBody")
                self.logger.info("proceed to send sqs queue")
                if "message_body" in kwargs:
                    kwargs.pop("message_body")
                response_data = self.client.send_message(
                    QueueUrl=queue_url, MessageBody=message_body, *args, **kwargs
                )
                self.logger.info("Send SQS Queue successfully")
                return Response(data=response_data)

            self.logger.error(
                "Failed to send SQS Queue, message body: '%s'. Details: QueueUrl Not Found."
                % message_body
            )
            return Response(data=Error("QueueUrl Not Found"), status_code=404, ok=False)

        except AttributeError:
            if self.client is None:
                self.logger.warning(
                    "You need to initialize the client before create queue."
                )
                return Response(
                    data=Error(
                        "You need to initialize the client before create queue."
                    ),
                    status_code=400,
                    ok=False,
                )

            return Response(data=Error("Attribute error"), status_code=400, ok=False)

        except ParamValidationError:
            self.logger.error(
                "Failed to send SQS Queue, message body: '%s'. Details: ParamValidationError"
                % message_body
            )
            return Response(
                data=Error("Param validation error"), status_code=400, ok=False
            )

        except Exception as e:
            errors = f"Failed to send SQS Queue, message body: '{message_body}'"
            traceback = ExceptionUtilities.stack_trace_as_string(e)
            self.logger.error(errors, ExceptionUtilities.stack_trace_as_string(e))
            return Response(data=Error(errors, traceback), status_code=400, ok=False)

    def get_queue_url(self, queue_name: str) -> str:
        self.logger.info("Proceed to get SQS Queue URL")
        response = self.client.get_queue_url(QueueName=queue_name)
        return response.get("QueueUrl", None)


class S3Client(Boto3Client):
    """Implements a Singleton Boto3 S3 Client"""

    _SERVICE_NAME = "s3"

    def create_bucket(self, bucket_name) -> Response:
        """Create the s3 bucket"""
        try:
            response_data = self.client.create_bucket(bucket_name)
            return self.response(response_data)

        except Exception as e:
            errors = "Failed to create bucket, bucket name '%s', region '%s'" % (
                bucket_name,
                self._config.region_name,
            )
            traceback = ExceptionUtilities.stack_trace_as_string(e)
            self.logger.error(errors, ExceptionUtilities.stack_trace_as_string(e))
            return Response(data=Error(errors, traceback), status_code=400, ok=False)

    def upload_file(
        self,
        filename: str,
        bucket: str,
        key: str = None,
        callback: object = None,
        extra_args: dict = None,
    ) -> Response:
        """Upload a file to an S3 bucket

        :param filename: File to upload
        :param bucket: S3 bucket to upload to
        :param key: S3 key. If not specified then filename is used
        :param callback: S3 callback
        :param extra_args: S3 extra args.
        :return: Response object
        """

        # If S3 key was not specified, use filename
        if key is None:
            key = os.path.basename(filename)

        try:
            self.logger.debug(
                "Process to upload file to S3, file name: '%s', bucket: '%s'"
                % (filename, bucket)
            )
            self.client.upload_file(
                Filename=filename,
                Bucket=bucket,
                Key=key,
                ExtraArgs=extra_args,
                Callback=callback,
            )
            return Response(data=f"https://{bucket}.s3.amazonaws.com/{key}")
        except Exception as e:
            self.logger.error(e)
            errors = "Failed to upload file to S3, file name: '%s', region '%s'" % (
                filename,
                self._config.region_name,
            )
            traceback = ExceptionUtilities.stack_trace_as_string(e)
            self.logger.error(errors, ExceptionUtilities.stack_trace_as_string(e))
            return Response(data=Error(errors, traceback), status_code=400, ok=False)

    def generate_pre_signed_url(
        self, bucket: str, key: str, expiration: int = 3600, clean_url: bool = True
    ) -> Response:
        """Generate a pre-signed URL to share an S3 object

        :param bucket: S3 bucket to upload to
        :param key: S3 key.
        :param expiration: Time in seconds for the pre-signed URL to remain valid
        :param clean_url: Remove parameters after '?' from response URL
        :return: Response object
        """

        try:
            self.logger.debug(
                "Process to get upload file url, key: '%s', bucket: '%s'"
                % (key, bucket)
            )
            response = self.client.generate_presigned_url(
                ClientMethod="get_object",
                Params={"Bucket": bucket, "Key": key},
                ExpiresIn=expiration,
            )

            if clean_url and "?" in response:
                response = response.split("?")[0]

        except ClientError as e:
            errors = "Failed to get upload file from S3, bucket: '%s', key '%s'" % (
                bucket,
                key,
            )
            traceback = ExceptionUtilities.stack_trace_as_string(e)
            self.logger.error(errors, ExceptionUtilities.stack_trace_as_string(e))
            return Response(data=Error(errors, traceback), status_code=400, ok=False)

        return Response(data=response, status_code=200)


sqs_client = SQSClient()
s3_client = S3Client()
