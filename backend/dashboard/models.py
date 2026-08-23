from django.db import models
from django.core.validators import FileExtensionValidator

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


class CollectionHero(models.Model):
    """Single, admin-managed video shown at the top of the collection page."""

    video = models.FileField(
        upload_to="hero/videos/",
        validators=[FileExtensionValidator(allowed_extensions=["mp4", "webm"])],
        blank=True,
        null=True,
        help_text="Upload an MP4 or WebM video. Use a compressed web video for fast loading.",
    )
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Collection hero video"
        verbose_name_plural = "Collection hero video"

    def __str__(self):
        return "Collection hero video"
