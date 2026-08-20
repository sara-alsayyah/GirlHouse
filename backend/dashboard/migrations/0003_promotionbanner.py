from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("dashboard", "0002_alter_heroslide_options_alter_heroslide_order")]

    operations = [
        migrations.CreateModel(
            name="PromotionBanner",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_enabled", models.BooleanField(default=True)),
                ("eyebrow", models.CharField(default="Special for you", max_length=80)),
                ("headline", models.CharField(default="Get 10% off your first order", max_length=160)),
                ("button_label", models.CharField(default="Shop now", max_length=50)),
                ("button_url", models.CharField(default="/products", max_length=255)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
