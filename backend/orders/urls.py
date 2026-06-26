from django.urls import path

from .views import (
    CheckoutAPIView,
    UserOrdersAPIView,
    OrderDetailAPIView,
)

app_name = "orders"

urlpatterns = [


    path(
        "checkout/",
        CheckoutAPIView.as_view(),
        name="checkout"
    ),


    path(
        "",
        UserOrdersAPIView.as_view(),
        name="user-orders"
    ),

    path(
        "<str:order_number>/",
        OrderDetailAPIView.as_view(),
        name="order-detail"
    ),
]