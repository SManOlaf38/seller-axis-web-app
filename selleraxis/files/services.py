import asyncio
import uuid

import boto3
from asgiref.sync import async_to_sync, sync_to_async
from botocore.config import Config
from django.conf import settings


def get_presigned_url():
    config = Config(
        region_name="us-east-1",
        signature_version="s3v4",
        retries={"max_attempts": 10, "mode": "standard"},
    )
    filename = str(uuid.uuid4())
    url = boto3.client("s3", config=config).generate_presigned_url(
        Params={"Bucket": settings.BUCKET_NAME, "Key": filename},
        ClientMethod="put_object",
        ExpiresIn=3600,
    )
    return url


@async_to_sync
async def get_multi_presigned_url(amount=1):
    return await asyncio.gather(
        *[sync_to_async(get_presigned_url)() for _ in range(amount)]
    )
