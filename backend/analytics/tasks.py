from django.utils import timezone
from django.db.models import Sum, Count

from config.celery import shared_task

from orders.models import Order
from users.models import User

from .models import DailyRevenue, DailyOrders, DailyCustomers


@shared_task
def refresh_daily_analytics():
    today = timezone.now().date()


    revenue = (
        Order.objects.filter(status='delivered', created_at__date=today)
        .aggregate(total=Sum('total_price'))['total'] or 0
    )

    DailyRevenue.objects.update_or_create(
        day=today,
        defaults={"revenue": revenue}
    )

    orders = Order.objects.filter(created_at__date=today).count()

    DailyOrders.objects.update_or_create(
        day=today,
        defaults={"count": orders}
    )

    customers = User.objects.filter(
        date_joined__date=today,
        is_staff=False
    ).count()

    DailyCustomers.objects.update_or_create(
        day=today,
        defaults={"count": customers}
    )