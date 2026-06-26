from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound

from products.models import Product
from .models import Cart, CartItem


class CartService:

    @staticmethod
    @transaction.atomic
    def add_to_cart(user, product_id, quantity):

        if quantity <= 0:
            return {"error": "Invalid quantity"}

        product = get_object_or_404(Product, id=product_id)

        if quantity > product.stock:
            return {"error": "Requested quantity exceeds stock"}

        cart, _ = Cart.objects.get_or_create(user=user)

        item, created = CartItem.objects.select_for_update().get_or_create(
            cart=cart,
            product=product
        )

        new_qty = item.quantity + quantity if not created else quantity

        if new_qty > product.stock:
            return {"error": "Requested quantity exceeds stock"}

        item.quantity = new_qty
        item.save()

        return {"success": True, "item": item}


    @staticmethod
    @transaction.atomic
    def update_item(user, item_id, quantity):

        if quantity <= 0:
            return {"error": "Quantity must be at least 1"}

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            raise NotFound("Cart not found")

        item = get_object_or_404(
            CartItem.objects.select_for_update(),
            id=item_id,
            cart=cart
        )

        if quantity > item.product.stock:
            return {"error": "Requested quantity exceeds stock"}

        item.quantity = quantity
        item.save()

        return {"success": True, "item": item}


    @staticmethod
    @transaction.atomic
    def remove_item(user, item_id):

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            raise NotFound("Cart not found")

        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()

        return {"success": True}


    @staticmethod
    def get_cart(user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart.items.select_related("product")
