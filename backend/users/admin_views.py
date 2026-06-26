from django.contrib.auth import get_user_model
from django.db.models.functions import Coalesce
from django.db.models import Count, Sum
from rest_framework import generics, serializers
from rest_framework.filters import OrderingFilter, SearchFilter

from core.permissions import IsAdmin


User = get_user_model()


class AdminCustomerSerializer(serializers.ModelSerializer):
    total_orders = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "phone",
            "total_orders",
            "total_spent",
            "date_joined",
            "is_staff",
            "is_active",
        ]
        read_only_fields = [
            "id",
            "email",
            "phone",
            "total_orders",
            "total_spent",
            "date_joined",
            "is_staff",
        ]


class AdminCustomersAPIView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminCustomerSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["email", "phone"]
    ordering_fields = ["date_joined", "email"]
    ordering = ["-date_joined"]

    def get_queryset(self):
        return (
            User.objects.annotate(
                total_orders=Count("order"),
                total_spent=Coalesce(Sum("order__total_price"), 0),
            )
            .order_by("-date_joined")
        )


class AdminCustomerDetailAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminCustomerSerializer
    lookup_field = "id"

    def get_queryset(self):
        return User.objects.annotate(
            total_orders=Count("order"),
            total_spent=Coalesce(Sum("order__total_price"), 0),
        )
