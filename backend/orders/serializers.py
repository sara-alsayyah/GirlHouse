from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product



class OrderProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
        ]



class OrderItemSerializer(serializers.ModelSerializer):

    product = OrderProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "product",
            "quantity",
            "price",
        ]


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True, read_only=True)

    items_count = serializers.IntegerField(source="items_count", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "total_price",
            "status",
            "payment_method",
            "created_at",
            "items",
            "items_count",
        ]