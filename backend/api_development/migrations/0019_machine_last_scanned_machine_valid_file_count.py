# Generated by Django 5.0.2 on 2024-05-08 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_development', '0018_alter_imagecheck_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='machine',
            name='last_scanned',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='machine',
            name='valid_file_count',
            field=models.IntegerField(default=0),
        ),
    ]
