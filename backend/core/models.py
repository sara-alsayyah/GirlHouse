from django.db import models


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)

    phone_number = models.CharField(max_length=20, null=True, blank=True)

    email = models.EmailField(blank=True, null=True)

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.phone_number}"
    

class City(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    

class DeliveryZone(models.Model):
    city = models.OneToOneField("core.City", on_delete=models.CASCADE)
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2)
    is_available = models.BooleanField(default=True)