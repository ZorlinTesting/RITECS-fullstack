# Generated by Django 5.0.2 on 2024-05-21 11:37

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_development', '0024_segmentation_extracted_data'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='metric',
            name='accuracy',
        ),
        migrations.RemoveField(
            model_name='metric',
            name='image',
        ),
        migrations.RemoveField(
            model_name='metric',
            name='user_agreement',
        ),
        migrations.AddField(
            model_name='metric',
            name='f1_score',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='metric',
            name='precision',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='metric',
            name='recall',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='metric',
            name='timestamp',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]