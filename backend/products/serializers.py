from rest_framework import serializers
from .models import Product, Category, WishlistItem, Review, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
        ]

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "is_main"]
class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    main_image = serializers.SerializerMethodField()

    average_rating = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()
    low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "stock",
            "images",
            "main_image",
            "slug",
            "category",
            "created_at",
            "average_rating",
            "is_in_stock",
            "low_stock",
        ]
    def get_main_image(self, obj):
        img = obj.images.filter(is_main=True).first()
        if img:
            return img.image.url

        img = obj.images.first()
        return img.image.url if img else None

class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = [
            "id",
            "product",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "rating",
            "comment",
            "created_at",
            "user_name",
        ]

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()


class AvailabilityFilterSerializer(serializers.Serializer):
    in_stock = serializers.BooleanField(required=False)


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "rating",
            "comment",
        ]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )
        return value

    def validate_comment(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Review comment is too short."
            )
        return value