from django.urls import path

from .admin_views import AdminSettingsAPIView


urlpatterns = [
    path("settings/", AdminSettingsAPIView.as_view()),
]
