from django.urls import path
from .views import AdminDashboardAPIView, HeroSlidesAPIView, PromotionBannerAPIView, AdminPromotionBannerAPIView

urlpatterns = [
    path("", AdminDashboardAPIView.as_view()),
     path("hero-slides/", HeroSlidesAPIView.as_view()),
     path("promotion/", PromotionBannerAPIView.as_view()),
     path("promotion/manage/", AdminPromotionBannerAPIView.as_view()),
]
