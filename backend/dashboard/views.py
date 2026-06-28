from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from django.db.models import Count, Sum, F
from django.db.models.functions import TruncMonth

from core.permissions import IsAdmin
from orders.models import Order, OrderItem
from products.models import Product
from users.models import User
from .models import HeroSlide
from .serializers import HeroSlideSerializer


class HeroSlideAPIView(APIView):
    permission_classes = []

    def get(self, request):
        slides = HeroSlide.objects.filter(is_active=True).order_by("order")
        serializer = HeroSlideSerializer(slides, many=True)
        return Response(serializer.data)

class AdminDashboardAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        data = cache.get("dashboard:admin:v1")

        if not data:
            monthly_revenue = list(
                Order.objects.filter(status="delivered")
                .annotate(month=TruncMonth("created_at"))
                .values("month")
                .annotate(revenue=Sum("total_price"), orders=Count("id"))
                .order_by("month")[:12]
            )

            data = {
                "total_revenue": float(
                    Order.objects.filter(status="delivered")
                    .aggregate(total=Sum("total_price"))["total"] or 0
                ),
                "total_orders": Order.objects.count(),
                "total_customers": User.objects.filter(is_staff=False).count(),
                "total_products": Product.objects.count(),
                "recent_orders": list(
                    Order.objects.select_related("user")
                    .annotate(items_count=Count("items"))
                    .order_by("-created_at")
                    .values(
                        "id",
                        "order_number",
                        customer=F("user__email"),
                        total_price_value=F("total_price"),
                        status_value=F("status"),
                        created_at_value=F("created_at"),
                        items_count_value=F("items_count"),
                    )[:5]
                ),
                 "top_products": [
                 {
                    "id": item["product__id"],
                    "name": item["product__name"],
                    "image": item["product__image"],
                    "price": float(item["product__price"] or 0),
                    "stock": item["product__stock"],
                    "total_sold": item["total_sold"],
                }
                for item in OrderItem.objects.filter(order__status="delivered")
                   .values(
                     "product__id",
                     "product__name",
                     "product__image",
                     "product__price",
                     "product__stock",
                    )
                   .annotate(total_sold=Sum("quantity"))
                   .order_by("-total_sold")[:5]
                   ],

            
                "monthly_revenue": [
                    {
                        "month": entry["month"].strftime("%Y-%m") if entry["month"] else None,
                        "revenue": float(entry["revenue"]),
                        "orders": entry["orders"],
                    }
                    for entry in monthly_revenue
                ],
                "order_status_stats": list(
                    Order.objects.values("status")
                    .annotate(count=Count("id"))
                    .order_by("status")
                ),
                "low_stock_products": list(
                    Product.objects.filter(stock__lte=Product.LOW_STOCK_THRESHOLD)
                    .values("id", "name", "stock")[:10]
                ),
            }

           
            cache.set("dashboard:admin:v1", data, 60 * 15)

        return Response(data)