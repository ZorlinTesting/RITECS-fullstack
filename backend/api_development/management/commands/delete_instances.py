from django.core.management.base import BaseCommand
from django.db import transaction
from api_development.models import Image  # Adjust this import to your model's actual location

class Command(BaseCommand):
    help = 'Deletes all instances of a specific model and dependent objects'

    def handle(self, *args, **options):
        with transaction.atomic():
            # Fetching all instances (optional, you could directly call .delete())
            instances = Image.objects.all()
            count = instances.count()

            # This will delete all instances of MyModel and any related objects
            # due to cascading delete behavior.
            instances.delete()

            self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} instances of Image and all dependent objects.'))
