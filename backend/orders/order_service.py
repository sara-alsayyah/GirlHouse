from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404

from products.models import Product
from audit.models import AdminActionLog

from .models import Order, OrderStatusHistory


class OrderService:

    ALLOWED_TRANSITIONS = {
        "pending": ["processing", "cancelled"],
        "processing": ["shipped", "cancelled"],
        "shipped": ["delivered"],
        "delivered": [],
        "cancelled": [],
    }

    @staticmethod
    @transaction.atomic
    def update_status(order_id, new_status, admin_user):

        order = get_object_or_404(
            Order.objects.select_for_update(),
            id=order_id
        )

        current_status = order.status

      
        if current_status == new_status:
            return {"error": "Order already in this status"}

        
        allowed = OrderService.ALLOWED_TRANSITIONS.get(current_status, [])

        if new_status not in allowed:
            return {
                "error": f"Cannot change {current_status} → {new_status}"
            }

       
        OrderStatusHistory.objects.create(
            order=order,
            old_status=current_status,
            new_status=new_status,
            changed_by=admin_user
        )

        order.status = new_status
        order.save(update_fields=["status"])

      
        AdminActionLog.objects.create(
            admin=admin_user,
            action=f"Changed order {order.order_number} → {new_status}"
        )

        return {"success": True, "order": order}

    @staticmethod
    @transaction.atomic
    def cancel_order(order_id, admin_user):

        order = get_object_or_404(
            Order.objects.select_for_update(),
            id=order_id
        )

        if order.status == "delivered":
            return {"error": "Delivered orders cannot be cancelled"}

        if order.status == "cancelled":
            return {"error": "Order already cancelled"}

        previous_status = order.status

        OrderService.rollback_stock(order)

    
        order.status = "cancelled"
        order.save(update_fields=["status"])

        OrderStatusHistory.objects.create(
            order=order,
            old_status=previous_status,
            new_status="cancelled",
            changed_by=admin_user
        )

  
        AdminActionLog.objects.create(
            admin=admin_user,
            action=f"Cancelled order {order.order_number}"
        )

        return {"success": True, "order": order}

 
    @staticmethod
    def rollback_stock(order):

        items = order.items.select_related("product")

        # optimized bulk updates per product
        for item in items:
            if item.product_id:
                Product.objects.filter(
                    id=item.product_id
                ).update(
                    stock=F("stock") + item.quantity
                )