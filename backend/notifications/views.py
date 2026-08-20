from rest_framework.generics import ListAPIView

from core.permissions import IsAdmin
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListAPIView(ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.all().order_by('-created_at')[:20]
