"""
Local settings
"""
import os

from botocore.config import Config

from selleraxis.core.clients.boto3_client import Boto3ClientManager, Configuration

from .common import *  # noqa

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

DEBUG = True

SECRET_KEY = "django-insecure-*$0b8ibx7uzk45cm+fxw7*jj(yzi2ye!l4+!dnyxa-u-nbuz=q"

ALLOWED_HOSTS = ["*"]

HOST = "http://localhost:8000/"

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "selleraxis",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

# CORS config
CORS_ALLOWED_ORIGINS = ["http://localhost:8000"]
CORS_ALLOW_HEADERS = ["Content-Type", "Accept", "Authorization", "organization"]


# Boto3 Client Config
BOTO3_CONFIGS = [
    Configuration(service_name="sqs"),
    Configuration(service_name="ses"),
    Configuration(
        service_name="s3",
        config=Config(s3={"addressing_style": "path"}, signature_version="s3v4"),
    ),
]
Boto3ClientManager.multiple_initialize(BOTO3_CONFIGS)

# S3 Bucket
BUCKET_NAME = os.getenv("BUCKET_NAME", "selleraxis-bucket-dev")  # noqa

# SES Client
SES_CLIENT = Boto3ClientManager.get("ses")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "viet.vo@digitalfortress.dev")  # noqa
WEBSITE_URL = os.getenv("WEBSITE_URL", "http://localhost:8000/api")

# SQS Config
SQS_CLIENT = Boto3ClientManager.get("sqs")
SQS_UPDATE_INVENTORY_SQS_NAME = os.getenv(
    "UPDATE_INVENTORY_SQS_NAME", "dev-update_inventory_sqs"
)
SQS_UPDATE_RETAILER_INVENTORY_SQS_NAME = os.getenv(
    "UPDATE_RETAILER_INVENTORY_SQS_NAME", "dev-update_retailer_inventory_sqs"
)
CRUD_PRODUCT_SQS_NAME = os.getenv("CRUD_PRODUCT_SQS_NAME", "dev-qbo_sync_product")
CRUD_RETAILER_SQS_NAME = os.getenv("CRUD_RETAILER_SQS_NAME", "dev-qbo_sync_retailer")
SQS_QBO_SYNC_UNHANDLED_DATA_NAME = os.getenv(
    "QBO_SYNC_UNHANDLED_DATA_NAME", "qbo_sync_unhandled_data_sqs"
)

SECRETE_KEY = os.getenv("SECRETE_KEY", "111")

# Default FedEx client
DEFAULT_FEDEX_CLIENT_ID = ""
DEFAULT_FEDEX_CLIENT_SECRET = ""

# QBO
QBO_CLIENT_ID = os.getenv("QBO_CLIENT_ID", "")
QBO_CLIENT_SECRET = os.getenv("QBO_CLIENT_SECRET", "")
QBO_ENVIRONMENT = os.getenv("QBO_ENVIRONMENT", "Sandbox")
QBO_QUICKBOOK_URL = os.getenv(
    "QBO_QUICKBOOK_URL", "https://sandbox-quickbooks.api.intuit.com"
)
QBO_REDIRECT_URL = os.getenv(
    "QBO_REDIRECT_URL", "http://localhost:8000/api/invoices/authorization-url"
)
QBO_TOKEN_ENDPOINT = os.getenv(
    "QBO_TOKEN_ENDPOINT", "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer"
)
