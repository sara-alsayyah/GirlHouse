from decimal import Decimal
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils import timezone

from cart.models import Cart
from products.models import Product
from users.models import Address

from .models import Order, OrderItem, Coupon, Payment


class CheckoutService:

    @staticmethod
    @transaction.atomic
    def create_order(user, address_id, payment_method="cod", coupon_code=None):

        try:
            cart = Cart.objects.select_for_update().get(user=user)
        except Cart.DoesNotExist:
            return {"error": "Cart not found"}

        cart_items = list(
            cart.items.select_related("product").select_for_update()
        )

        if not cart_items:
            return {"error": "Cart is empty"}

       
        address = get_object_or_404(Address, id=address_id, user=user)

       
        product_ids = [item.product_id for item in cart_items]
        products = Product.objects.select_for_update().filter(id__in=product_ids)
        product_map = {p.id: p for p in products}

        
        for item in cart_items:
            product = product_map.get(item.product_id)

            if not product:
                return {"error": "Product not found"}

            if item.quantity <= 0:
                return {"error": f"Invalid quantity for {product.name}"}

            if product.stock < item.quantity:
                return {"error": f"Not enough stock for {product.name}"}

       
        subtotal = sum(
            product_map[item.product_id].price * item.quantity
            for item in cart_items
        )

        subtotal = Decimal(subtotal)

       
        discount = Decimal("0")
        coupon_obj = None

        if coupon_code:
            try:
                coupon_obj = Coupon.objects.get(
                    code__iexact=coupon_code,
                    active=True
                )
            except Coupon.DoesNotExist:
                return {"error": "Invalid coupon"}

            if coupon_obj.valid_until and coupon_obj.valid_until < timezone.now():
                return {"error": "Coupon expired"}

            if coupon_obj.max_uses and coupon_obj.used_count >= coupon_obj.max_uses:
                return {"error": "Coupon usage limit reached"}

            discount = (
                subtotal * coupon_obj.discount_percent / Decimal("100")
            ).quantize(Decimal("0.01"))

        total_price = subtotal - discount

      
        order = Order.objects.create(
            user=user,
            total_price=total_price,
            address=address,
            payment_method=payment_method,
            coupon=coupon_obj
        )

      
        Payment.objects.create(
            order=order,
            user=user,
            method=payment_method,
            amount=total_price,
            status="pending" if payment_method == "whish" else "verified"
        )

       
        order_items = []

        for item in cart_items:
            product = product_map[item.product_id]

            order_items.append(
                OrderItem(
                    order=order,
                    product=product,
                    quantity=item.quantity,
                    price=product.price
                )
            )

            updated = Product.objects.filter(
                id=product.id,
                stock__gte=item.quantity
            ).update(stock=F("stock") - item.quantity)

            if not updated:
                raise Exception(f"Stock conflict for {product.name}")

        OrderItem.objects.bulk_create(order_items)

        
        if coupon_obj:
            Coupon.objects.filter(id=coupon_obj.id).update(
                used_count=F("used_count") + 1
            )

      
        cart.items.all().delete()

        return {
            "order": order,
            "subtotal": subtotal,
            "discount": discount,
            "total": total_price,
            "coupon": coupon_obj.code if coupon_obj else None
        }