from django.db import migrations


def seed_existing_hero_video(apps, schema_editor):
    CollectionHero = apps.get_model("dashboard", "CollectionHero")

    if not CollectionHero.objects.exists():
        # The repository already contains this store asset. New uploads use
        # hero/videos/ through the model's FileField.
        CollectionHero.objects.create(video="hero/hero.mp4", is_active=True)


def remove_seeded_hero_video(apps, schema_editor):
    CollectionHero = apps.get_model("dashboard", "CollectionHero")
    CollectionHero.objects.filter(video="hero/hero.mp4").delete()


class Migration(migrations.Migration):
    dependencies = [("dashboard", "0004_collection_hero_video")]

    operations = [migrations.RunPython(seed_existing_hero_video, remove_seeded_hero_video)]
