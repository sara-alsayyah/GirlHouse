from django.contrib import admin
from .models import Category, Product, Wishlist, WishlistItem, Review
from audit.models import AdminActionLog

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "category",
        "price",
        "stock",
        "average_rating_display",
        "low_stock_flag",
        "created_at",
    )

    list_filter = (
        "category",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
        "slug",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }

    def average_rating_display(self, obj):
        return obj.average_rating

    average_rating_display.short_description = "Rating"

    def low_stock_flag(self, obj):
        return "⚠ Low Stock" if obj.stock <= 5 else "✓ Healthy"

    low_stock_flag.short_description = "Inventory"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        AdminActionLog.objects.create(
           admin=request.user,
           action_type="product_create" if not change else "product_update",
           message=f"{'Created' if not change else 'Updated'} product {obj.name}"
    )

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user',)


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('wishlist', 'product')
    search_fields = ('product__name', 'wishlist__user__email')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
