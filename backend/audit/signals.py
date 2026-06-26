from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from audit.models import AdminActionLog
from products.models import Product
from orders.models import Order


def log_change(instance, action_type, message):
    AdminActionLog.objects.create(
        admin=getattr(instance, "updated_by", None),
        action_type=action_type,
        message=message
    )


@receiver(pre_save, sender=Product)
def product_before_update(sender, instance, **kwargs):
    if instance.pk:
        old = Product.objects.get(pk=instance.pk)

        instance._old_state = {
            "name": old.name,
            "price": old.price,
            "stock": old.stock,
        }


@receiver(post_save, sender=Product)
def product_after_update(sender, instance, created, **kwargs):

    action = "product_create" if created else "product_update"

    AdminActionLog.objects.create(
        admin=None,  
        action_type=action,
        message=f"{'Created' if created else 'Updated'} product {instance.name}"
    )