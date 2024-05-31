from django.contrib import admin
from django.utils.safestring import mark_safe

# Register your models here.
from .models import Image, ImageCheck, ImageMetadata, Segmentation, SessionInstance, Date, Machine, Correction, Metric

class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'machine', 'check_date', 'segmentation_filename')  # Customize as needed
    search_fields = ['title']  # Add search functionality
    list_filter = ('uploaded_at',)  # Add filters

    def check_date(self, obj):
        return obj.date.date if obj.date else 'No check date'
    
    def segmentation_filename(self, obj):
        # This method returns the filename of the related Segmentation, if it exists
        return obj.segmentation.filename if obj.segmentation else 'No Segmentation'
    segmentation_filename.short_description = 'Segmentation File'

from django.utils.html import format_html
class ImageCheckAdmin(admin.ModelAdmin):
    list_display = ('id', 'image_display', 'target_classType', 'affected_segments', 'display_segmentation_data')  # Customize as needed
    search_fields = ['image_display']  # Add search functionality
    # list_filter = ('check_date',)  # Add filters

    def get_queryset(self, request):
        # Optimizing queryset to prefetch related Image objects
        queryset = super().get_queryset(request).select_related('image')
        return queryset

    def image_display(self, obj):
        # Accessing the image_file attribute from the related Image object
        return obj.image.title
    image_display.short_description = 'Image Filename'  # Sets column name

    def display_segmentation_data(self, obj):
        if not obj.image:
            return "No Image"

        # Truncate segmentation data to a maximum of 50 characters
        data = str(obj.image.segmentation.segmentation_data)
        max_length = 50
        truncated_data = (data[:max_length] + '...') if len(data) > max_length else data

        # Access segmentation data through the ForeignKey
        segmentation = obj.image.segmentation
        return format_html(
            "<strong>Segmentation ID:</strong> {}<br>"
            "<strong>Data:</strong> {}",
            segmentation.id,
            truncated_data
        )

    display_segmentation_data.short_description = 'Segmentation Data'

    # # Optional: If image_file is a FileField/ImageField and you want to display it as an image in the admin
    # def image_display(self, obj):
    #     if obj.image.image_file:
    #         return mark_safe('<img src="{}" width="150" />'.format(obj.image.image_file.url))
    #     return "-"
    # image_display.short_description = 'Image'

class MachineAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'related_directory', 'images_count', 'valid_file_count')  # Customize as needed

    def images_count(self, obj):
        return obj.images.count()
    images_count.short_description = 'Image Count'

class SessionInstanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'login_time', 'logout_time', 'session_key')  # Customize as needed
    search_fields = ['user']  # Add search functionality
    list_filter = ('user',)  # Add filters

class DateAdmin(admin.ModelAdmin):
    list_display = ('date', 'images_count', 'accomplished')

    def images_count(self, obj):
        return obj.images.count()
    images_count.short_description = 'Image Count' 


# class ImageCheckInline(admin.TabularInline):  # or use admin.StackedInline for a different layout
#     model = Correction.proposed_corrections.through  # This accesses the through model of the M2M relationship
#     extra = 1  # How many extra forms to show
#     fields = ['image', 'target_classType', 'affected_segments']  # Adjust fields based on what you want to display

from django import forms
class CorrectionForm(forms.ModelForm):
    class Meta:
        model = Correction
        fields = '__all__'  # Include all fields, you can customize this as needed

    def __init__(self, *args, **kwargs):
        super(CorrectionForm, self).__init__(*args, **kwargs)
        instance = kwargs.get('instance')

        # Limiting the queryset for the proposed_corrections field
        if instance and instance.pk:
            self.fields['proposed_corrections'].queryset = instance.proposed_corrections.all()
        else:
            self.fields['proposed_corrections'].queryset = ImageCheck.objects.none()


class CorrectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'checked_by', 'submission_datetime', 'display_image_checks')  # Customize as needed
    # search_fields = ['title']  # Add search functionality
    list_filter = ('checked_by',)  # Add filters
    # inlines = [ImageCheckInline]
    form = CorrectionForm

    def display_image_checks(self, obj):
        image_checks = obj.proposed_corrections.all()
        # Create a formatted string for each ImageCheck
        formatted_checks = [
            f"{check.target_classType} - [{', '.join(map(str, check.affected_segments))}]"
            if check.affected_segments else f"{check.target_classType} - []"
            for check in image_checks
        ]
        # Join all formatted strings with a pipe separator
        return "   |   ".join(formatted_checks)
    display_image_checks.short_description = 'Image Checks Details'

    readonly_fields = ['image_checks_display']

    def image_checks_display(self, obj):
        return "\n".join([f"{ic.image.title}: {ic.target_classType} - {ic.affected_segments}" for ic in obj.proposed_corrections.all()])
    image_checks_display.short_description = "Image Checks"

class SegmentationAdmin(admin.ModelAdmin):
    list_display = ('id', 'filename', 'created_at', 'updated_at', 'extracted_data')

class MetricAdmin(admin.ModelAdmin):
    list_display = ('id', 'timestamp', 'total_true_positives', 'total_false_positives', 'total_false_negatives', 'total_class_mismatches', 'precision', 'recall', 'f1_score')

admin.site.register(Date, DateAdmin)
admin.site.register(Segmentation, SegmentationAdmin)
admin.site.register(SessionInstance, SessionInstanceAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(ImageCheck, ImageCheckAdmin)
admin.site.register(Metric, MetricAdmin)
admin.site.register(Machine, MachineAdmin)
admin.site.register(Correction, CorrectionAdmin)


# TODO: look into previous django works to apply customizations to admin 'list view' and 'change view'