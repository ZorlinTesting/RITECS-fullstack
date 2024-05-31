from celery import shared_task, group, chord, chain
from django.core.files import File
from .models import Image, Date, Segmentation, Machine
import os
from datetime import datetime

MEDIA_DIRECTORY_CONSTANT = r"C:\Users\Kenny Vienne Manding\source\repos\RITECS\RCS Back-end\media\test_images"

#region SINGLE WORKER
# @shared_task
# def scan_directory_and_create_images(directory_path):
#     for filename in os.listdir(directory_path):
#         if filename.endswith('.png'):
#             full_path = os.path.join(directory_path, filename)
#             # Check if image already exists to prevent duplicates
#             if not Image.objects.filter(title=filename).exists():
#                 with open(full_path, 'rb') as file:
#                     image = Image(image_file=File(file), title=filename)
#                     image.save()

# @shared_task
# def process_images(directory_path):
#     # Chain tasks: First scan directory and create images, then create date objects and link images to dates
#     result = (scan_directory_and_create_images.s(directory_path) | 
#               create_date_objects.s() |
#               link_images_to_dates.s())
#     result()
#endregion

from django.utils import timezone
import pytz
@shared_task
def create_date_objects():
    # Extract uploaded datetimes from all Image objects
    uploaded_datetimes = Image.objects.values_list('uploaded_at', flat=True)
    
    # Normalize datetimes to UTC
    uploaded_datetimes = [dt.astimezone(pytz.utc) for dt in uploaded_datetimes]
    
    # Extract and format dates from datetimes
    unique_dates = set([dt.date() for dt in uploaded_datetimes])
    
    # Create date objects for any missing dates
    for date in unique_dates:
        Date.objects.get_or_create(date=date)

@shared_task
def link_images_to_dates():
    for image in Image.objects.filter(date__isnull=True):
        date_obj, _ = Date.objects.get_or_create(date=image.uploaded_at.date())
        image.date = date_obj
        image.save()

@shared_task
def link_images_to_segmentation():
    # images_without_segmentation = Image.objects.filter(segmentation__isnull=True)
    # for image in images_without_segmentation:
    #     new_title = image.title.replace("src", "rslt")
    #     new_title = new_title.replace("bmp", "txt").replace("png", "txt")
    #     segmentation = Segmentation.objects.filter(filename=new_title).first()
    #     if segmentation:
    #         image.segmentation = segmentation
    #         image.save()

    for image in Image.objects.all():
        new_title = image.title.replace("src", "rslt")
        new_title = new_title.replace("bmp", "txt").replace("png", "txt")
        segmentation = Segmentation.objects.filter(filename=new_title).first()
        if segmentation:
            print(segmentation.filename)
            image.segmentation = segmentation
            image.save()
#region MULTI-WORKER
# @shared_task
# def process_image_file(filename):
#     full_path = os.path.join(settings.MEDIA_ROOT, 'test_images', filename)
#     print(f"Attempting to open: {full_path}")  # Debugging output

#     if not Image.objects.filter(title=filename).exists():
#         with open(full_path, 'rb') as file:
#             image = Image(image_file=File(file), title=filename)
#             image.save()
#             return image.uploaded_at.date()
#     return None
@shared_task
def process_image_file(filename, machine_id):
    machine = Machine.objects.get(id=machine_id)
    directory_path = clean_string(machine.related_directory)
    # full_path = os.path.join(settings.MEDIA_ROOT, directory_path, filename)
    full_path = os.path.join(settings.EXTERNAL_FILES_PATH, directory_path, filename)
    print(f"Attempting to open: {full_path}")  # Debugging output

    # Skip files with 'rslt' in the filename
    if 'rslt' in filename:
        return None

    # Construct the image_ref with directory
    image_ref = os.path.join(directory_path, filename)

    if not Image.objects.filter(image_ref=image_ref).exists():
        with open(full_path, 'rb') as file:
            # Create image with the full image_ref including the directory
            image = Image(machine=machine, image_ref=image_ref, title=filename)
            image.save()
            return image.uploaded_at.date()
    return None

@shared_task
def process_text_file(filename, directory_path):
    # text_path = os.path.join(settings.MEDIA_ROOT, 'images', filename)
    # directory_path = "test_images"  # Set the directory path
    # full_path = os.path.join(settings.MEDIA_ROOT, directory_path, filename)
    full_path = os.path.join(settings.EXTERNAL_FILES_PATH, directory_path, filename)
    print(f"Attempting to open: {full_path}")  # Debugging output

    if not Segmentation.objects.filter(filename=filename).exists():
        with open(full_path, 'r') as file:
            data = file.read()
            segmentation = Segmentation(filename=filename, segmentation_data=data)
            segmentation.save()
            return filename  # or any relevant data
    return None

from django.conf import settings

@shared_task
def initiate_workflow(machine_id):
    machine = Machine.objects.get(id=machine_id)
    directory_path = clean_string(machine.related_directory)
    # images_path = os.path.join(settings.MEDIA_ROOT, directory_path)
    images_path = os.path.join(settings.EXTERNAL_FILES_PATH, directory_path)
    valid_extensions = ['.png', '.bmp']  # Include both PNG and BMP files

    # Define the task signatures for processing images
    # task_signatures = [
    #     # process_image_file.s(os.path.join(directory_path, filename), filename)
    #     process_image_file.s(filename)
    #     for filename in os.listdir(images_path) if filename.endswith('.png')
    # ]
    # task_signatures = [
    #     process_image_file.s(filename)
    #     for filename in os.listdir(images_path)
    #     if any(filename.endswith(ext) for ext in valid_extensions) and 'rslt' not in filename
    # ]
    
    # # Create a group for the image processing tasks
    # task_group = group(task_signatures)

    # Create task signatures for processing images and text files
    image_signatures = [
        process_image_file.s(filename, machine_id)
        for filename in os.listdir(images_path)
        if any(filename.endswith(ext) for ext in valid_extensions) and 'rslt' not in filename
    ]

    text_signatures = [
        process_text_file.s(filename, directory_path)
        for filename in os.listdir(images_path)
        if filename.endswith('.txt')
    ]

    # Create groups for the tasks
    image_group = group(image_signatures)
    text_group = group(text_signatures)
    
    # Define the workflow chain
    workflow = chain(
        group(image_group, text_group),                # First, execute all process_image_file tasks in parallel
        create_date_objects.si(),  
        link_images_to_dates.si(),        
        link_images_to_segmentation.si()
    )
    
    # Start the workflow
    workflow.apply_async()

import logging

logger = logging.getLogger(__name__)

from api_development.utilities import clean_string

@shared_task
def check_directories_and_initiate_workflows():
    valid_extensions = ['.png', '.bmp', '.txt']
    machines = Machine.objects.all()
    task_chain = None
    logger.debug("The task is starting.")
    
    
    for machine in machines:
        logger.debug(machine.name)
        directory_path = clean_string(machine.related_directory)
        # images_path = os.path.join(settings.MEDIA_ROOT, directory_path)
        images_path = os.path.join(settings.EXTERNAL_FILES_PATH, directory_path)
        files = [f for f in os.listdir(images_path) if os.path.isfile(os.path.join(images_path, f)) and os.path.splitext(f)[1] in valid_extensions]
        current_count = len(files)

        # Checking if the count of valid files has increased since last scan
        if current_count > machine.valid_file_count:
            machine.valid_file_count = current_count
            machine.save()  # Save the new count and last scanned time
            
            # Chain the tasks
            if task_chain is None:
                task_chain = initiate_workflow.si(machine.id)
            else:
                task_chain |= initiate_workflow.si(machine.id)

    # Apply the chained tasks asynchronously
    if task_chain:
        task_chain.apply_async()

    return "Task Completed"

from .models import Metric
from collections import defaultdict
from .models import Correction
import logging

logger = logging.getLogger(__name__)

# tasks for calculating metrics
@shared_task
def calculate_metrics():
    total_true_positives = 0
    total_false_positives = 0
    total_false_negatives = 0
    total_class_mismatches = 0
                
    for image in Image.objects.all():
        corrections = Correction.objects.filter(proposed_corrections__image=image)
        if not corrections.exists():
            continue

        segmentation_data = image.segmentation.extracted_data if image.segmentation else []

        segment_votes = defaultdict(lambda: defaultdict(int))
        for correction in corrections:
            for check in correction.proposed_corrections.all():
                for segment_id in check.affected_segments:
                    segment_votes[segment_id][check.target_classType] += 1

        consensus_segments = {}
        for segment_id, votes in segment_votes.items():
            consensus_class = max(votes, key=votes.get)
            consensus_segments[segment_id] = consensus_class

        print(f"Consensus Segments: {consensus_segments}")

        checked_segment_ids = set(consensus_segments.keys())
        print(f"Checked Segment IDs: {checked_segment_ids}")

        for segment in segmentation_data:
            print(f"Segment ID: {segment['id']}")
            if segment['id'] in checked_segment_ids:
                consensus_class = consensus_segments[segment['id']]
                print(f"System Class: {segment['classType']} | Consensus Class: {consensus_class}")
                if segment['classType'] == int(consensus_class):
                    total_true_positives += 1
                    print(f"TP Incremented: {total_true_positives}")
                else:
                    total_class_mismatches += 1
                    print(f"CM Incremented: {total_class_mismatches}")
            else:
                total_false_negatives += 1
                print(f"FN Incremented: {total_false_negatives}")

        for segment_id, consensus_class in consensus_segments.items():
            if segment_id not in [seg['id'] for seg in segmentation_data]:
                total_false_positives += 1
                print(f"FP Incremented: {total_false_positives}")


    # Calculate precision, recall, and F1 score
    precision = (total_true_positives / (total_true_positives + total_false_positives)) if (total_true_positives + total_false_positives) > 0 else 0.0
    recall = (total_true_positives / (total_true_positives + total_false_negatives)) if (total_true_positives + total_false_negatives) > 0 else 0.0
    f1_score = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0
    accuracy = (total_true_positives / (total_true_positives + total_false_positives + total_false_negatives + total_class_mismatches)) if (total_true_positives + total_false_positives + total_false_negatives + total_class_mismatches) > 0 else 0.0

    Metric.objects.create(
        total_true_positives=total_true_positives,
        total_false_positives=total_false_positives,
        total_false_negatives=total_false_negatives,
        total_class_mismatches=total_class_mismatches,
        precision=precision,
        recall=recall,
        f1_score=f1_score,
        accuracy=accuracy
    )

    print(f"Generated metrics: TPs: {total_true_positives}, FPs: {total_false_positives}, FNs: {total_false_negatives}, Class Mismatches: {total_class_mismatches}, Precision: {precision}, Recall: {recall}, F1 Score: {f1_score}, Accuracy: {accuracy}")


    return "Task Completed"

@shared_task
def test_task():
    print('Test task successfully performed!')