import csv

from django.http import HttpResponse
from django.db import transaction
from django.db.models import Count, F
from django.shortcuts import get_object_or_404
from django.core.cache import cache

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from core.permissions import IsAdmin
from audit.models import AdminActionLog

from products.models import Product
from .models import Order, OrderStatusHistory, Payment
from .admin_serializers import (
    AdminOrderListSerializer,
    AdminOrderDetailSerializer,
    UpdateOrderStatusSerializer,
)


CACHE_PREFIX = "dashboard:admin:*"


class VerifyPaymentAPIView(APIView):
    permission_classes = [IsAdmin]

    @transaction.atomic
    def post(self, request, payment_id):

        payment = get_object_or_404(Payment, id=payment_id)
        action = request.data.get("action")

        if action not in ["approve", "reject"]:
            return Response({"error": "Invalid action"}, status=400)

        if action == "approve":

            old_status = payment.order.status

            payment.status = "verified"
            payment.save()

            # order update + history
            OrderStatusHistory.objects.create(
                order=payment.order,
                old_status=old_status,
                new_status="processing",
                changed_by=request.user,
            )

            payment.order.status = "processing"
            payment.order.save(update_fields=["status"])

            AdminActionLog.objects.create(
                admin=request.user,
                action=f"Approved payment for order {payment.order.order_number}",
            )

            return Response({"message": "Payment approved"})

        else:

            payment.status = "rejected"
            payment.save()

            AdminActionLog.objects.create(
                admin=request.user,
                action=f"Rejected payment for order {payment.order.order_number}",
            )

            return Response({"message": "Payment rejected"})


class UploadWhishReceiptAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, payment_id):

        payment = get_object_or_404(
            Payment,
            id=payment_id,
            user=request.user
        )

        payment.transaction_id = request.data.get("transaction_id")

        if "screenshot" in request.FILES:
            payment.screenshot = request.FILES["screenshot"]

        payment.save()

        return Response({"message": "Payment proof submitted"})


class AdminOrdersAPIView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminOrderListSerializer

    queryset = (
        Order.objects.select_related("user", "address")
        .annotate(items_count=Count("items"))
        .order_by("-created_at")
    )

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status"]
    search_fields = ["id", "user__email"]
    ordering_fields = ["created_at", "total_price", "status"]
    ordering = ["-created_at"]



class AdminOrderDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminOrderDetailSerializer

    queryset = Order.objects.select_related(
        "user", "address"
    ).prefetch_related("items__product")

    lookup_field = "id"


class UpdateOrderStatusAPIView(APIView):
    permission_classes = [IsAdmin]

    ALLOWED_TRANSITIONS = {
        "pending": ["processing", "cancelled"],
        "processing": ["shipped", "cancelled"],
        "shipped": ["delivered"],
        "delivered": [],
        "cancelled": [],
    }

    @transaction.atomic
    def patch(self, request, id):

        order = get_object_or_404(Order.objects.select_for_update(), id=id)

        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data["status"]
        current_status = order.status

        if new_status not in self.ALLOWED_TRANSITIONS.get(current_status, []):
            return Response(
                {"error": f"Cannot change {current_status} → {new_status}"},
                status=400,
            )

        OrderStatusHistory.objects.create(
            order=order,
            old_status=current_status,
            new_status=new_status,
            changed_by=request.user,
        )

        order.status = new_status
        order.save(update_fields=["status"])

        AdminActionLog.objects.create(
            admin=request.user,
            action=f"Changed order {order.order_number} → {new_status}",
        )

        cache.delete_pattern(CACHE_PREFIX)

        return Response({"message": "Status updated successfully"})


class CancelOrderAPIView(APIView):
    permission_classes = [IsAdmin]

    @transaction.atomic
    def delete(self, request, id):

        order = get_object_or_404(Order.objects.select_for_update(), id=id)

        if order.status in ["delivered", "cancelled"]:
            return Response(
                {"error": "Order cannot be cancelled"},
                status=400,
            )

        # rollback stock
        for item in order.items.select_related("product"):
            Product.objects.filter(id=item.product_id).update(
                stock=F("stock") + item.quantity
            )

        previous_status = order.status
        order.status = "cancelled"
        order.save(update_fields=["status"])

        OrderStatusHistory.objects.create(
            order=order,
            old_status=previous_status,
            new_status="cancelled",
            changed_by=request.user,
        )

        AdminActionLog.objects.create(
            admin=request.user,
            action=f"Cancelled order {order.order_number}",
        )

        cache.delete_pattern(CACHE_PREFIX)

        return Response({"message": "Order cancelled"})



class ExportOrdersCSVAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="orders.csv"'

        writer = csv.writer(response)
        writer.writerow(["Order ID", "Customer", "Total", "Status", "Date"])

        orders = (
            Order.objects.select_related("user")
            .only("id", "total_price", "status", "created_at", "user__email")
            .iterator()
        )

        for o in orders:
            writer.writerow([
                o.id,
                o.user.email,
                o.total_price,
                o.status,
                o.created_at
            ])

        AdminActionLog.objects.create(
            admin=request.user,
            action="Exported orders CSV",
        )

        return response
