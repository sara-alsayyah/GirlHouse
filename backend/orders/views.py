from django.core.cache import cache

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from .models import Order
from .serializers import OrderSerializer
from .checkout_service import CheckoutService


class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    ALLOWED_PAYMENT_METHODS = {"cod", "whish"}

    def post(self, request):

        address_id = request.data.get("address_id")
        payment_method = request.data.get("payment_method", "cod")
        coupon_code = request.data.get("coupon")

      
        try:
            address_id = int(address_id)
        except (TypeError, ValueError):
            return Response({"error": "address_id is required"}, status=400)

        if payment_method not in self.ALLOWED_PAYMENT_METHODS:
            return Response({"error": "Invalid payment method"}, status=400)

        result = CheckoutService.create_order(
            user=request.user,
            address_id=address_id,
            payment_method=payment_method,
            coupon_code=coupon_code,
        )

        if "error" in result:
            return Response(result, status=400)

    
        try:
            cache.delete_pattern("dashboard:admin:*")
        except Exception:
            pass

        order = result["order"]

     
        return Response({
            "message": "Order placed successfully",
            "order": {
                "id": order.id,
                "order_number": order.order_number,
                "status": order.status,
            },
            "summary": {
                "subtotal": float(result["subtotal"]),
                "discount": float(result["discount"]),
                "total": float(result["total"]),
                "coupon": result["coupon"],
            }
        })



class UserOrdersAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
            .order_by("-created_at")
        )



class OrderDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    lookup_field = "order_number"

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
