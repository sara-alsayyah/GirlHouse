from django.urls import path

from .views import (
    AnalyticsAPIView,
    RevenueAnalyticsAPIView,
    OrdersAnalyticsAPIView,
    CustomerAnalyticsAPIView,
)

urlpatterns = [
    path("", AnalyticsAPIView.as_view()),
    path("revenue/", RevenueAnalyticsAPIView.as_view()),
    path("orders/", OrdersAnalyticsAPIView.as_view()),
    path("customers/", CustomerAnalyticsAPIView.as_view()),
]