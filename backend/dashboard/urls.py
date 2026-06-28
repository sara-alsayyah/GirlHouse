from django.urls import path
from .views import AdminDashboardAPIView, HeroSlideAPIView

urlpatterns = [
    path("", AdminDashboardAPIView.as_view()),
     path("hero-slides/", HeroSlideAPIView.as_view()),
]