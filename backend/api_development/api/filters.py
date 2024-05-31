from django_filters import rest_framework as filters
from api_development.models import Image

class ImageFilter(filters.FilterSet):
    class Meta:
        model = Image
        fields = {
            'id': ['exact', 'in'],  # React Admin might send a list of IDs for filtering
            # Add other fields based on the front-end requirements
        }
