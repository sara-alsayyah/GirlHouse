from django.db import models

class HeroSlide(models.Model):
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="hero/")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title or f"Hero {self.id}"


class PromotionBanner(models.Model):
    is_enabled = models.BooleanField(default=True)
    eyebrow = models.CharField(max_length=80, default="Special for you")
    headline = models.CharField(max_length=160, default="Get 10% off your first order")
    button_label = models.CharField(max_length=50, default="Shop now")
    button_url = models.CharField(max_length=255, default="/products")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.headline
