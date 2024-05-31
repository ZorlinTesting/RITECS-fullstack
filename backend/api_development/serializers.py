from rest_framework import serializers
from .models import Item
from django.conf import settings

# region test
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'description']

        from rest_framework import serializers
# endregion

from rest_framework import serializers
from .models import Image, Segmentation, ImageMetadata, ImageCheck, Date, Machine, Correction, SessionInstance, Metric
from django.contrib.auth.models import User


class SegmentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segmentation
        fields = ['id', 'segmentation_data', 'filename', 'created_at', 'updated_at']

class ImageMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageMetadata
        fields = ['author', 'copyright', 'license_type', 'created_at', 'updated_at']

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['id', 'name']

class ImageCheckSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ImageCheck
        fields = ['id', 'image', 'status', 'target_classType', 'affected_segments']

class ImageSerializer(serializers.ModelSerializer):
    segmentation = SegmentationSerializer(read_only=True)
    metadata = ImageMetadataSerializer(read_only=True)
    machine = MachineSerializer(read_only=True)
    image_checks = ImageCheckSerializer(source='checks', many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
    # Returns the absolute URL for the image based on image_ref field.
        if obj.image_ref:
            request = self.context.get('request')  # Get the request object from serializer context
        if request is not None:
            return request.build_absolute_uri(f"{settings.MEDIA_URL}{obj.image_ref}")
        return None  # Or a placeholder URL if desired


    class Meta:
        model = Image
        fields = ['id', 'image_ref', 'image_url', 'title', 'description', 'uploaded_at', 'segmentation', 'metadata', 'image_checks', 'machine']

# endregion

class DateSerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = Date
        fields = ['id', 'formatted_date', 'accomplished']

    def get_formatted_date(self, obj):
        return obj.formatted_date().isoformat()


import logging

logger = logging.getLogger(__name__)
    
class CorrectionSerializer(serializers.ModelSerializer):
    checked_by = serializers.SlugRelatedField(
        slug_field='username', 
        queryset=User.objects.all(),
        allow_null=True,
        required=False
    )

    proposed_corrections = ImageCheckSerializer(many=True)
    class Meta:
        model = Correction
        fields = ['id', 'checked_by', 'submission_datetime', 'check_date', 'proposed_corrections', 'status']

    def create(self, validated_data):
        logger.debug('Creating correction with data: %s', validated_data)
        
        image_checks_data = validated_data.pop('proposed_corrections')
        correction = Correction.objects.create(**validated_data)
        
        for check_data in image_checks_data:
            logger.debug('Processing ImageCheck data: %s', check_data)

            # Extract image and affected_segments directly since they are correctly formatted
            image = check_data.get('image')  # Assuming this is an Image instance
            affected_segments = check_data.get('affected_segments', [])  # Default to empty if not provided

            # Create the ImageCheck instance without setting correction here
            image_check = ImageCheck.objects.create(
                image=image,
                target_classType=check_data.get('target_classType', ''),  # Default to empty string if not provided
                affected_segments=affected_segments
            )

            # Add the newly created ImageCheck instance to the Correction
            correction.proposed_corrections.add(image_check)

            # Log details for debugging
            logger.debug("--> Added ImageCheck to Correction: %s, Image: %s, Segments: %s", image_check, image, affected_segments)

        return correction

class SessionInstanceSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    duration = serializers.SerializerMethodField()

    class Meta:
        model = SessionInstance
        fields = ['id', 'user', 'login_time', 'logout_time', 'session_key', 'duration']

    def get_duration(self, obj):
        if obj.login_time and obj.logout_time:
            return (obj.logout_time - obj.login_time).total_seconds() / 60  # duration in minutes
        return None  # In case login_time or logout_time is not set


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'is_active', 'date_joined']

class MetricSerializer(serializers.ModelSerializer):
    sums = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

    class Meta:
        model = Metric
        fields = ['id', 'timestamp', 'accuracy', 'precision', 'recall', 'f1_score', 'sums']

    def get_sums(self, obj):
        if obj.total_true_positives is not None:  # Ensure the field exists and is not None
            sub_stats = [
                {'TP': obj.total_true_positives},
                {'FP': obj.total_false_positives},
                {'FN': obj.total_false_negatives},
                {'CM': obj.total_class_mismatches}
            ]
            return sub_stats
        return []
