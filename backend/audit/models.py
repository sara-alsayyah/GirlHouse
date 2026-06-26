from django.db import models
from django.conf import settings


class AdminActionLog(models.Model):

    ACTION_TYPES = [
        ("order_update", "Order Update"),
        ("order_cancel", "Order Cancel"),
        ("product_update", "Product Update"),
        ("product_create", "Product Create"),
        ("user_update", "User Update"),
        ("login", "Admin Login"),
        ("logout", "Admin Logout"),
        ("stock_update", "Stock Update"),
        ("security_event", "Security Event"),
    ]

    admin = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name="admin_actions"
)

    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)

    message = models.TextField()

   
    object_id = models.CharField(max_length=50, null=True, blank=True)
    object_type = models.CharField(max_length=50, null=True, blank=True)

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.admin} - {self.action_type}"