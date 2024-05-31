# my_app/management/commands/create_periodic_tasks.py
from django.core.management.base import BaseCommand
from django_celery_beat.models import PeriodicTask, IntervalSchedule

class Command(BaseCommand):
    help = 'Create periodic tasks'

    def handle(self, *args, **kwargs):
        # Schedule for calculate_metrics (every 1 hour)
        schedule_metrics, created = IntervalSchedule.objects.get_or_create(
            every=1,
            period=IntervalSchedule.HOURS
        )
        task_name_metric = 'Calculate Metrics'
        if not PeriodicTask.objects.filter(name=task_name_metric).exists():
            PeriodicTask.objects.get_or_create(
                interval=schedule_metrics,
                name=task_name_metric,
                task='api_development.tasks.calculate_metrics',
            )
            self.stdout.write(self.style.SUCCESS(f'Periodic task "{task_name_metric}" created.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Periodic task "{task_name_metric}" already exists.'))

        # Schedule for check_directories_and_initiate_workflows (every day)
        schedule_workflows, created = IntervalSchedule.objects.get_or_create(
            every=1,
            period=IntervalSchedule.DAYS
        )
        task_name_directories = 'Check Directories and Initiate Workflows'
        if not PeriodicTask.objects.filter(name=task_name_directories).exists():
            PeriodicTask.objects.get_or_create(
                interval=schedule_workflows,
                name=task_name_directories,
                task='api_development.tasks.check_directories_and_initiate_workflows',
            )
            self.stdout.write(self.style.SUCCESS(f'Periodic task "{task_name_directories}" created.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Periodic task "{task_name_directories}" already exists.'))

        # Schedule for test_task (every 5 minutes)
        schedule_test, created = IntervalSchedule.objects.get_or_create(
            every=1,
            period=IntervalSchedule.MINUTES
        )

        name='Test Task',
        if not PeriodicTask.objects.filter(name=name).exists():
            PeriodicTask.objects.get_or_create(
                interval=schedule_test,
                name=name,
                task='api_development.tasks.test_task',  # Ensure you have a task named test_task
            )
            self.stdout.write(self.style.SUCCESS(f'Periodic task "{name}" created.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Periodic task "{name}" already exists.'))