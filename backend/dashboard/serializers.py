from rest_framework import serializers
from .models import HeroSlide, PromotionBanner

class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = ["id", "title", "subtitle", "image", "order"]


class PromotionBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotionBanner
        fields = ["is_enabled", "eyebrow", "headline", "button_label", "button_url"]

class RecentOrderSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    order_number = serializers.CharField()
    customer = serializers.CharField()
    status = serializers.CharField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    created_at = serializers.DateTimeField()


class DashboardSerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_orders = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_products = serializers.IntegerField()

    recent_orders = RecentOrderSerializer(many=True)

    top_products = serializers.ListField()
    order_status_stats = serializers.ListField()
    monthly_revenue = serializers.ListField()
    low_stock_products = serializers.ListField()
