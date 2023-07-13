"""
Local settings
"""
import boto3
from botocore.config import Config

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

# S3 Bucket
S3_CLIENT = boto3.client(
    "s3", config=Config(s3={"addressing_style": "path"}, signature_version="s3v4")
)
BUCKET_NAME = "selleraxis-bucket-dev"

# SQS Client
SQS_CLIENT = boto3.client(
    service_name="sqs",
)
