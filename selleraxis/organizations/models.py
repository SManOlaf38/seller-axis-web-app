from django.db import models

from selleraxis.users.models import User


class Organization(models.Model):
    name = models.CharField(max_length=255)
    avatar = models.TextField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    timezone = models.CharField(blank=True, default="", max_length=128)
    address = models.CharField(blank=True, default="", max_length=255)
    email = models.CharField(blank=True, default="", max_length=255)
    phone = models.CharField(blank=True, default="", max_length=128)
    status = models.CharField(blank=True, default="", max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
