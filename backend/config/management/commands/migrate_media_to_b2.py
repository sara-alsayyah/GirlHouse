from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.files import File
from django.core.files.storage import default_storage

from dashboard.models import HeroSlide, CollectionHero
from products.models import ProductImage
from orders.models import Payment


def upload_file(field_file, stdout):
    if not field_file:
        return False

    name = field_file.name

    if default_storage.exists(name):
        stdout.write(f"EXISTS   {name}")
        return False

    local_path = Path(settings.MEDIA_ROOT) / name

    if not local_path.exists():
        stdout.write(f"MISSING  {local_path}")
        return False

    with local_path.open("rb") as f:
        default_storage.save(name, File(f))

    stdout.write(f"UPLOADED {name}")
    return True


class Command(BaseCommand):
    help = "Upload existing local Django media files to the configured B2 storage."

    def handle(self, *args, **options):
        uploaded = 0

        self.stdout.write("\n=== COLLECTION HERO VIDEO ===")
        for obj in CollectionHero.objects.exclude(video=""):
            uploaded += upload_file(obj.video, self.stdout)

        self.stdout.write("\n=== HERO IMAGES ===")
        for obj in HeroSlide.objects.exclude(image=""):
            uploaded += upload_file(obj.image, self.stdout)

        self.stdout.write("\n=== PRODUCT IMAGES ===")
        for obj in ProductImage.objects.exclude(image=""):
            uploaded += upload_file(obj.image, self.stdout)

        self.stdout.write("\n=== PAYMENT SCREENSHOTS ===")
        for obj in Payment.objects.exclude(screenshot=""):
            uploaded += upload_file(obj.screenshot, self.stdout)

        self.stdout.write(self.style.SUCCESS(f"\n=== MIGRATION COMPLETE ({uploaded} uploaded) ==="))
