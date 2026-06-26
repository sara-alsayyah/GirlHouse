from rest_framework import serializers
from django.db.models import Count

from .models import Product, Category, Review


class AdminCategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "products_count"]
        read_only_fields = ["id", "slug", "products_count"]


class AdminCategoryListSerializer(AdminCategorySerializer):
    pass


class AdminReviewSerializer(serializers.ModelSerializer):
    customer_email = serializers.CharField(source="user.email", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "customer_email",
            "product_name",
            "rating",
            "comment",
            "status",
            "created_at",
        ]
        read_only_fields = fields


class AdminProductListSerializer(serializers.ModelSerializer):
    category = AdminCategorySerializer()
    low_stock = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "price",
            "stock",
            "image",
            "slug",
            "category",
            "created_at",
            "low_stock",
            "average_rating",
            "is_in_stock",
        ]

    def get_low_stock(self, obj):
        return obj.stock <= Product.LOW_STOCK_THRESHOLD


class AdminProductDetailSerializer(serializers.ModelSerializer):
    category = AdminCategorySerializer()
    average_rating = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()
    low_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["slug", "created_at", "updated_at"]

    def get_low_stock(self, obj):
        return obj.stock <= Product.LOW_STOCK_THRESHOLD


class AdminProductCreateUpdateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Product
        fields = [
            "name",
            "description",
            "price",
            "stock",
            "image",
            "category"
        ]


    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Product name cannot be empty.")
        return value
