from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count, F

from orders.models import Order, OrderItem
from users.models import User

from .models import DailyRevenue, DailyOrders, DailyCustomers


class AnalyticsService:

    @staticmethod
    def top_products(limit=5):
        return (
            OrderItem.objects.filter(order__status='delivered')
            .values(product_id=F('product__id'), name=F('product__name'))
            .annotate(total_sold=Sum('quantity'))
            .order_by('-total_sold')[:limit]
        )

    @staticmethod
    def summary(days=30):
        start_date = timezone.now() - timedelta(days=days)

        total_sales = (
            Order.objects.filter(status='delivered', created_at__gte=start_date)
            .aggregate(total=Sum('total_price'))['total'] or 0
        )

        return {
            "total_sales": float(total_sales),
            "total_orders": Order.objects.filter(created_at__gte=start_date).count(),
            "top_products": list(AnalyticsService.top_products()),
        }


    @staticmethod
    def revenue(days=30):
        return DailyRevenue.objects.all().order_by('-day')[:days]

    @staticmethod
    def orders(days=30):
        return DailyOrders.objects.all().order_by('-day')[:days]

    @staticmethod
    def customers(days=30):
        return DailyCustomers.objects.all().order_by('-day')[:days]