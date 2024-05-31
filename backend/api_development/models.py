from django.db import models
from django.conf import settings

class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

from django.utils.timezone import localtime, make_aware
from datetime import datetime
import pytz

class Date(models.Model):
    date = models.DateField(unique=True)
    accomplished = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.date} - {'Accomplished' if self.accomplished else 'Pending'}"
    
    def formatted_date(self):
        # Converts the date to UTC
        aware_date = make_aware(datetime.combine(self.date, datetime.min.time()))
        return aware_date.astimezone(pytz.utc).date()


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/{1}'.format(instance.user.id, filename)

class Machine(models.Model):
    name = models.CharField(max_length=100)
    related_directory = models.CharField(max_length=255, blank=True, null=True)
    valid_file_count = models.IntegerField(default=0)
    last_scanned = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"

import re

def parse_and_filter_segmentations(segmentation_data):
    print('parse_and_filter_segmentation function activated!')
    if not segmentation_data:
        return []

    segments = segmentation_data.split("|")
    extracted_data = []
    for sub_region in segments:
        parts = sub_region.split(",")
        id_str = re.sub(r'[^\d]', '', parts[0])
        if id_str:
            id = int(id_str, 10)
        else:
            continue
        class_type = int(parts[1])
        x = float(parts[2])
        y = float(parts[3])
        width = float(parts[4])
        height = float(parts[5])
        extracted_data.append({
            'id': id,
            'classType': class_type,
            'x': x,
            'y': y,
            'width': width,
            'height': height
        })
    return extracted_data

class Segmentation(models.Model):
    filename = models.CharField(max_length=255)
    segmentation_data = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    extracted_data = models.JSONField(null=True, blank=True)

    def save(self, *args, **kwargs):
        print("Custom save method called!")
        if self.segmentation_data:
            self.extracted_data = parse_and_filter_segmentations(self.segmentation_data)

        super().save(*args, **kwargs)

    # def parse_segmentation_data(self):
    #     # Assuming parseAndFilterSegmentations is adapted for the model method
    #     return parse_and_filter_segmentations(self.segmentation_data)
    
    def __str__(self):
        return f"{self.filename}"


class Image(models.Model):
    # image_file = models.ImageField(upload_to='images/')
    image_ref = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    date = models.ForeignKey(Date, on_delete=models.SET_NULL, related_name="images", blank=True, null=True, db_index=True)
    machine = models.ForeignKey(Machine, related_name='images', on_delete=models.SET_NULL, null=True, db_index=True)
    segmentation = models.ForeignKey(Segmentation, related_name='images', on_delete=models.CASCADE, null=True)
    def __str__(self):
        return f"{self.title}"


class ImageMetadata(models.Model):
    image = models.OneToOneField(Image, related_name='metadata', on_delete=models.CASCADE)
    author = models.CharField(max_length=255, blank=True)
    copyright = models.CharField(max_length=255, blank=True)
    license_type = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ImageCheck(models.Model):
    image = models.ForeignKey(Image, related_name='checks', on_delete=models.CASCADE, blank=True)
    status = models.CharField(max_length=50, default='pending', 
        choices=(('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'))
    )

    target_classType = models.CharField(max_length=100, db_index=True)
    affected_segments = models.JSONField(blank=True, null=True)  
    confirmed = models.BooleanField(default=False)


    class Meta:
        verbose_name = 'Image Check'
        verbose_name_plural = 'Image Checks'

    def __str__(self):
        return f"Image Check on {self.image.title}"

class Correction(models.Model):
    checked_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
        null=True, blank=True, related_name='image_checks')
    submission_datetime = models.DateTimeField(auto_now_add=True, db_index=True)
    check_date = models.DateTimeField(blank=True, null=True)
    proposed_corrections = models.ManyToManyField(ImageCheck, related_name='corrections')

    status = models.CharField(max_length=50, default='pending', 
        choices=(('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')), blank=True, null=True
    )

    class Meta:
        verbose_name = 'Correction'
        verbose_name_plural = 'Corrections'
    
    def __str__(self):
        return f"{self.submission_datetime} - {self.checked_by}"


from django.contrib.auth.models import User
class SessionInstance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    session_key = models.CharField(max_length=40, blank=True, null=True)

    def __str__(self):
        return f"Session for {self.user.username} starting at {self.login_time}"

from django.utils.timezone import now
class Metric(models.Model):
    timestamp = models.DateTimeField(default=now)

    total_true_positives = models.IntegerField(default=0)
    total_false_positives = models.IntegerField(default=0)
    total_false_negatives = models.IntegerField(default=0)
    total_class_mismatches = models.IntegerField(default=0)

    precision = models.FloatField(null=True, blank=True)
    recall = models.FloatField(null=True, blank=True)
    f1_score = models.FloatField(null=True, blank=True)
    accuracy = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.timestamp}"


# TODO: add temporal dimension to Metric objects