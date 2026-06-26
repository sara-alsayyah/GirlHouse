from rest_framework import serializers


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