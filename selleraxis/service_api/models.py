from django.db import models

from selleraxis.services.models import Services


class ServiceAPI(models.Model):
    action = models.CharField(max_length=255)
    sandbox_url = models.CharField(max_length=255)
    production_url = models.CharField(max_length=255)
    method = models.CharField(max_length=255)
    body = models.TextField()
    response = models.TextField()
    service = models.ForeignKey(Services, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
