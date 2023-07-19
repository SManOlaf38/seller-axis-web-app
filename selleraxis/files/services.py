import asyncio
import uuid

from asgiref.sync import async_to_sync, sync_to_async
from django.conf import settings

from selleraxis.core.clients.boto3_client import s3_client


def get_presigned_url():
    object_name = str(uuid.uuid4())
    response = s3_client.generate_presigned_post(settings.BUCKET_NAME, object_name)
    return response.data


@async_to_sync
async def get_multi_presigned_url(amount=1):
    return await asyncio.gather(
        *[sync_to_async(get_presigned_url)() for _ in range(amount)]
    )
