from rest_framework import serializers

from .models import RetailerQueueHistory


class RetailerQueueHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RetailerQueueHistory
        fields = "__all__"
