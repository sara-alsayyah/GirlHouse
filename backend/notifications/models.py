from django.db import models
from users.models import User
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class Notification(models.Model):

    TYPE_CHOICES = (
        ('order', 'Order'),
        ('stock', 'Stock'),
        ('system', 'System'),
    )
     
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)


class AdminNotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.channel_layer.group_add("admin_notifications", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("admin_notifications", self.channel_name)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["data"]))