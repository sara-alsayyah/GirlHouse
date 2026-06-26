from django.urls import include
from django.urls import path

urlpatterns = [
    path(
        "products/",
        include("products.admin_urls")
    ),

    path(
        "orders/",
        include("orders.admin_urls")
    ),

    path(
        "users/",
        include("users.admin_urls")
    ),

    path(
        "core/",
        include("core.admin_urls")
    ),

    path(
        "dashboard/",
        include("dashboard.urls")
    ),

    path(
        "analytics/",
        include("analytics.urls")
    ),

    path(
        "notifications/",
        include("notifications.urls")
    ),
]
