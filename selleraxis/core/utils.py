import logging
from traceback import TracebackException

from botocore.exceptions import ParamValidationError
from django.conf import settings


def send_sqs(queue_name: str, message_body: str) -> bool | dict:
    try:
        queue_url_response = settings.SQS_CLIENT.get_queue_url(QueueName=queue_name)
        queue_url = queue_url_response.get("QueueUrl", None)
        if queue_url:
            response = settings.SQS_CLIENT.send_message(
                QueueUrl=queue_url, MessageBody=message_body
            )
            return response
    except ParamValidationError:
        logging.error(
            "Failed to send sqs queue, queue name '%s', message body: '%s'. Details: ParamValidationError"
            % (queue_name, message_body)
        )
    except Exception as e:
        logging.error(
            "Failed to send sqs queue, queue name '%s', message body: '%s'. Details: '%s'",
            queue_name,
            message_body,
            "".join(TracebackException.from_exception(e).format()),
        )


class DataUtilities:
    @staticmethod
    def from_data_to_object_ids(data):
        unique_ids = []
        if isinstance(data, list):
            for obj in data:
                unique_id = obj.get("id")
                if unique_id and unique_id not in unique_ids:
                    unique_ids.append(obj["id"])

        return unique_ids
