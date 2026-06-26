from django.urls import path
from .admin_views import (
    AdminCategoryDetailAPIView,
    AdminCategoryListCreateAPIView,
    AdminProductListCreateAPIView,
    AdminProductDetailAPIView,
    AdminReviewListAPIView,
)

urlpatterns = [
    path("categories/", AdminCategoryListCreateAPIView.as_view()),
    path("categories/<int:id>/", AdminCategoryDetailAPIView.as_view()),
    path("products/", AdminProductListCreateAPIView.as_view()),
    path("products/<int:id>/", AdminProductDetailAPIView.as_view()),
    path("reviews/", AdminReviewListAPIView.as_view()),
]
