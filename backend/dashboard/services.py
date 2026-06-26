from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count, F, ExpressionWrapper, DecimalField
from django.db.models.functions import TruncDay

from orders.models import Order, OrderItem
from products.models import Product
from users.models import User


class DashboardService:

    @staticmethod
    def get_dashboard_data():

        last_30_days = timezone.now() - timedelta(days=30)

        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        total_customers = User.objects.filter(is_staff=False).count()

        total_revenue = (
            Order.objects.filter(status="delivered")
            .aggregate(total=Sum("total_price"))["total"] or 0
        )

        # ---------- RECENT ORDERS ----------
        recent_orders_qs = (
            Order.objects.select_related("user")
            .order_by("-created_at")[:10]
        )

        recent_orders = [
            {
                "id": o.id,
                "order_number": o.order_number,
                "customer": o.user.email,
                "status": o.status,
                "total_price": o.total_price,
                "created_at": o.created_at,
            }
            for o in recent_orders_qs
        ]

        # ---------- ORDER STATUS ----------
        order_status_stats = list(
            Order.objects.values("status").annotate(count=Count("id"))
        )

        # ---------- TOP PRODUCTS ----------
        top_products = list(
            OrderItem.objects.values(
                "product__id",
                "product__name",
                "product__image",
            )
            .annotate(
                total_sold=Sum("quantity"),
                revenue=Sum(
                    ExpressionWrapper(
                        F("quantity") * F("price"),
                        output_field=DecimalField()
                    )
                ),
            )
            .order_by("-total_sold")[:5]
        )

        # ---------- LOW STOCK ----------
        low_stock_products = list(
            Product.objects.filter(
                stock__lte=Product.LOW_STOCK_THRESHOLD
            ).values("id", "name", "stock", "slug")
        )

        # ---------- MONTHLY REVENUE ----------
        monthly_revenue = list(
            Order.objects.filter(
                created_at__gte=last_30_days,
                status="delivered",
            )
            .annotate(day=TruncDay("created_at"))
            .values("day")
            .annotate(total=Sum("total_price"))
            .order_by("day")
        )

        return {
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "total_customers": total_customers,
            "total_products": total_products,

            "recent_orders": recent_orders,
            "order_status_stats": order_status_stats,
            "top_products": top_products,
            "monthly_revenue": monthly_revenue,
            "low_stock_products": low_stock_products,
        }