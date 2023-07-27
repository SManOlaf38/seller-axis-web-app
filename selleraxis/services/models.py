from django.db import models


class ServiceType(models.TextChoices):
    INVOICE = "INVOICE"
    SHIPPING = "SHIPPING"


class Services(models.Model):
    name = models.CharField(max_length=128)
    type = models.CharField(max_length=128, choices=ServiceType.choices)
    general_client_id = models.TextField()
    general_client_secret = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
