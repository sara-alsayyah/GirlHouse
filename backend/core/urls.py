from django.urls import path
from .views import CityListAPIView, ContactAPIView

urlpatterns = [
    path("contact/", ContactAPIView.as_view(), name="contact"),
    path("cities/", CityListAPIView.as_view(), name="cities"),
]
