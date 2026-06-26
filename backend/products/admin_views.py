from rest_framework import generics, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from core.permissions import IsAdmin
from django.db.models import Prefetch
from django.db.models import Count

from .models import Category, Product, Review
from .admin_serializers import (
    AdminCategorySerializer,
    AdminProductListSerializer,
    AdminProductDetailSerializer,
    AdminProductCreateUpdateSerializer,
    AdminReviewSerializer,
)


class AdminProductListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAdmin]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    filterset_fields = ["category__id", "is_active", "featured"]
    search_fields = ["name", "description"]
    ordering_fields = ["price", "stock", "created_at"]

    def get_queryset(self):
        return (
            Product.objects
            .select_related("category")
            .prefetch_related(
                Prefetch(
                    "reviews",
                    queryset=Review.objects.filter(status="approved")
                )
            )
            .order_by("-created_at")
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AdminProductCreateUpdateSerializer
        return AdminProductListSerializer

    def perform_create(self, serializer):
        serializer.save()


class AdminProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    lookup_field = "id"

    def get_queryset(self):
        return (
            Product.objects
            .select_related("category")
            .prefetch_related("reviews")
        )

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return AdminProductCreateUpdateSerializer
        return AdminProductDetailSerializer

    def destroy(self, request, *args, **kwargs):
       instance = self.get_object()
       self.perform_destroy(instance)
       return Response({"message": "Product deleted successfully"})


class AdminCategoryListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminCategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "slug"]
    ordering_fields = ["name"]
    ordering = ["name"]

    def get_queryset(self):
        return Category.objects.annotate(products_count=Count("products")).order_by("name")


class AdminCategoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminCategorySerializer
    lookup_field = "id"

    def get_queryset(self):
        return Category.objects.annotate(products_count=Count("products"))

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Category deleted successfully"})


class AdminReviewListAPIView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["rating", "status"]
    search_fields = ["user__email", "product__name", "comment"]
    ordering_fields = ["created_at", "rating"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Review.objects.select_related("user", "product").order_by("-created_at")
