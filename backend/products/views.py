from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Product,
    Wishlist,
    WishlistItem,
    Review
)

from .serializers import (
    ProductSerializer,
    WishlistItemSerializer,
    ReviewSerializer,
    ReviewCreateSerializer
)


class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer

    queryset = (
        Product.objects
        .select_related("category")
        .prefetch_related("reviews")
        .order_by("-created_at")
    )

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["category__slug"]

    search_fields = [
        "name",
        "description",
    ]

    ordering_fields = [
        "price",
        "created_at",
    ]

    def get_queryset(self):
        queryset = super().get_queryset()

        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        in_stock = self.request.query_params.get("in_stock")

        if in_stock in ["true", "1", "True"]:
            queryset = queryset.filter(stock__gt=0)

        elif in_stock in ["false", "0", "False"]:
            queryset = queryset.filter(stock__lte=0)

        return queryset


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = (
        Product.objects
        .select_related("category")
        .prefetch_related("reviews")
    )

    serializer_class = ProductSerializer
    lookup_field = "slug"


class ProductReviewsAPIView(APIView):

    def get(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)

        reviews = (
            product.reviews
            .filter(status="approved")
            .select_related("user")
            .order_by("-created_at")
        )

        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)


class AddToWishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")

        if not product_id:
            return Response(
                {"error": "product_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = get_object_or_404(Product, id=product_id)

        wishlist, _ = Wishlist.objects.get_or_create(
            user=request.user
        )

        item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist,
            product=product
        )

        if not created:
            return Response(
                {"message": "Already in wishlist"},
                status=status.HTTP_200_OK
            )

        return Response(
            {"message": "Added to wishlist"},
            status=status.HTTP_201_CREATED
        )


class WishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(
            user=request.user
        )

        items = (
            wishlist.items
            .select_related(
                "product",
                "product__category"
            )
            .all()
        )

        serializer = WishlistItemSerializer(
            items,
            many=True
        )

        return Response(serializer.data)


class RemoveFromWishlistAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, product_id):
        wishlist, _ = Wishlist.objects.get_or_create(
            user=request.user
        )

        item = get_object_or_404(
            WishlistItem,
            wishlist=wishlist,
            product_id=product_id
        )

        item.delete()

        return Response(
            {"message": "Removed from wishlist"},
            status=status.HTTP_200_OK
        )


class AddReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        product = get_object_or_404(
            Product,
            id=product_id
        )

        serializer = ReviewCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        existing_review = Review.objects.filter(
            user=request.user,
            product=product
        ).first()

        if existing_review:
            return Response(
                {"error": "You already reviewed this product"},
                status=status.HTTP_400_BAD_REQUEST
            )

        Review.objects.create(
            user=request.user,
            product=product,
            rating=serializer.validated_data["rating"],
            comment=serializer.validated_data.get(
                "comment",
                ""
            ),
        )

        return Response(
            {
                "message": "Review submitted successfully and is awaiting approval."
            },
            status=status.HTTP_201_CREATED
        )