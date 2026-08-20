from django.contrib import admin

from django.contrib import admin
from .models import HeroSlide, PromotionBanner

@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "order", "is_active")
    list_editable = ("order", "is_active")


@admin.register(PromotionBanner)
class PromotionBannerAdmin(admin.ModelAdmin):
    list_display = ("headline", "is_enabled", "updated_at")

