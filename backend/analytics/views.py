from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response

from core.permissions import IsAdmin
from .services import AnalyticsService


CACHE_TTL = 60 * 5


class AnalyticsAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        days = int(request.query_params.get("days", 30))
        cache_key = f"analytics:summary:{days}"

        cached = cache.get(cache_key)
        if cached:
            return Response(cached)

        data = AnalyticsService.summary(days)

        cache.set(cache_key, data, CACHE_TTL)
        return Response(data)


class RevenueAnalyticsAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        cache_key = "analytics:revenue"
        cached = cache.get(cache_key)

        if cached:
            return Response(cached)

        data = list(AnalyticsService.revenue())

        cache.set(cache_key, data, CACHE_TTL)
        return Response(data)


class OrdersAnalyticsAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        cache_key = "analytics:orders"
        cached = cache.get(cache_key)

        if cached:
            return Response(cached)

        data = list(AnalyticsService.orders())

        cache.set(cache_key, data, CACHE_TTL)
        return Response(data)


class CustomerAnalyticsAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        cache_key = "analytics:customers"
        cached = cache.get(cache_key)

        if cached:
            return Response(cached)

        data = list(AnalyticsService.customers())

        cache.set(cache_key, data, CACHE_TTL)
        return Response(data)