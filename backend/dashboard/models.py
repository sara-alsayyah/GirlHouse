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