from django.urls import path

from .admin_views import (
    AdminOrdersAPIView,
    AdminOrderDetailAPIView,
    UpdateOrderStatusAPIView,
    CancelOrderAPIView,
    ExportOrdersCSVAPIView,
)

urlpatterns = [

    path("", AdminOrdersAPIView.as_view(), name="admin-orders-list"),
    path("export/", ExportOrdersCSVAPIView.as_view(), name="admin-orders-export"),

    path("<int:id>/", AdminOrderDetailAPIView.as_view(), name="admin-order-detail"),

    path("<int:id>/status/", UpdateOrderStatusAPIView.as_view(), name="admin-order-status"),
    path("<int:id>/cancel/", CancelOrderAPIView.as_view(), name="admin-order-cancel"),
]
