from django.contrib import admin

from django.contrib import admin
from .models import CollectionHero, HeroSlide, PromotionBanner

@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "order", "is_active")
    list_editable = ("order", "is_active")


@admin.register(PromotionBanner)
class PromotionBannerAdmin(admin.ModelAdmin):
    list_display = ("headline", "is_enabled", "updated_at")


@admin.register(CollectionHero)
class CollectionHeroAdmin(admin.ModelAdmin):
    list_display = ("id", "is_active", "updated_at")
    list_editable = ("is_active",)

    def has_add_permission(self, request):
        return not CollectionHero.objects.exists()

