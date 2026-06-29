from django.urls import path
from .views import AdminDashboardAPIView, HeroSlidesAPIView

urlpatterns = [
    path("", AdminDashboardAPIView.as_view()),
     path("hero-slides/", HeroSlidesAPIView.as_view()),
]