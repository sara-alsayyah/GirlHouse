from django.urls import path

from .admin_views import AdminCustomerDetailAPIView, AdminCustomersAPIView


urlpatterns = [
    path("customers/", AdminCustomersAPIView.as_view()),
    path("customers/<int:id>/", AdminCustomerDetailAPIView.as_view()),
]
