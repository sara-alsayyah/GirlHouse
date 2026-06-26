from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdmin
from .models import DeliveryZone


class AdminSettingsAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        zones = (
            DeliveryZone.objects.select_related("city")
            .filter(city__is_active=True)
            .order_by("city__name")
        )

        fees = [zone.delivery_fee for zone in zones if zone.is_available]
        standard_fee = min(fees) if fees else 0

        return Response(
            {
                "store": {
                    "store_name": "GIRL HOUSE",
                    "support_email": settings.DEFAULT_FROM_EMAIL,
                    "phone": "",
                    "address": "Lebanon",
                },
                "shipping": {
                    "free_shipping_threshold": 0,
                    "standard_shipping_fee": standard_fee,
                },
                "payment": {
                    "cash_on_delivery": True,
                    "stripe_enabled": False,
                    "whish_enabled": True,
                },
                "notifications": {
                    "order_emails": settings.EMAIL_BACKEND != "",
                    "review_notifications": True,
                },
                "security": {
                    "two_factor_auth": False,
                },
            }
        )
