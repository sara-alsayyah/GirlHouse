from celery import shared_task
from django.core.cache import cache
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count, F, ExpressionWrapper, DecimalField
from django.db.models.functions import TruncDay

from orders.models import Order, OrderItem
from products.models import Product
from users.models import User


@shared_task
def refresh_dashboard_cache():

    last_30_days = timezone.now() - timedelta(days=30)

    data = {
        "total_revenue": Order.objects.filter(status="delivered")
            .aggregate(total=Sum("total_price"))["total"] or 0,

        "total_orders": Order.objects.count(),

        "total_customers": User.objects.filter(is_staff=False).count(),

        "total_products": Product.objects.count(),

        "recent_orders": list(
            Order.objects.select_related("user")
            .order_by("-created_at")[:10]
            .values("id", "order_number", "user__email", "status", "total_price", "created_at")
        ),

        "top_products": list(
            OrderItem.objects.values("product__name")
            .annotate(total_sold=Sum("quantity"))
            .order_by("-total_sold")[:5]
        ),

        "monthly_revenue": list(
            Order.objects.filter(status="delivered", created_at__gte=last_30_days)
            .annotate(day=TruncDay("created_at"))
            .values("day")
            .annotate(total=Sum("total_price"))
            .order_by("day")
        ),
    }

    cache.set("dashboard:admin:v1", data, timeout=None)

    return data