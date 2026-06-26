from rest_framework import serializers
from users.serializers import AddressSerializer
from .models import Order, OrderItem


class AdminOrderListSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source="user.email")
    items_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "customer",
            "items_count",
            "total_price",
            "status",
            "payment_method",
            "created_at",
        ]
        read_only_fields = fields


class AdminOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name")

    class Meta:
        model = OrderItem
        fields = ["product_name", "quantity", "price"]
        read_only_fields = fields


class AdminOrderDetailSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source="user.email")
    address = AddressSerializer(read_only=True)

    items = AdminOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "customer",
            "total_price",
            "status",
            "payment_method",
            "created_at",
            "updated_at",
            "address",
            "items",
        ]
        read_only_fields = fields


class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
