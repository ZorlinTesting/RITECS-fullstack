from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Item
from .serializers import ItemSerializer
from django.http import Http404
# from rest_framework_api_key.permissions import HasAPIKey

# NOTE: The use of APIView allows greater control and granularity, while ModelViewSet (in conjuction with urls.router)
#  allows for less boilerplate if the models conform to standard CRUD operations

# region Testing Views
from django.http import HttpResponse
def home_view(request):
    return HttpResponse('<h1>Welcome to RITECS API</h1>')

class ItemList(APIView):
    def get(self, request, format=None):
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ItemDetail(APIView):
    def get_object(self, pk):
        try:
            return Item.objects.get(pk=pk)
        except Item.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        item = self.get_object(pk)
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        item = self.get_object(pk)
        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        item = self.get_object(pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
# endregion

# region Separated Views
# from rest_framework import viewsets
# from .models import Image, Segmentation, ImageMetadata
# from .serializers import ImageSerializer, SegmentationSerializer, ImageMetadataSerializer

# class ImageViewSet(viewsets.ModelViewSet):
#     queryset = Image.objects.all()
#     serializer_class = ImageSerializer

# class SegmentationViewSet(viewsets.ModelViewSet):
#     queryset = Segmentation.objects.all()
#     serializer_class = SegmentationSerializer

# class ImageMetadataViewSet(viewsets.ModelViewSet):
#     queryset = ImageMetadata.objects.all()
#     serializer_class = ImageMetadataSerializer

# endregion

# region ViewSet implementing Nested Serializer
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Image, Segmentation, ImageMetadata, ImageCheck, Date, Machine, Correction, User, SessionInstance, Metric
from .serializers import ImageSerializer, ImageCheckSerializer, DateSerializer, CorrectionSerializer, UserSerializer, SessionInstanceSerializer, MetricSerializer

from .api.mixins import SortMixin
from .api.filters import ImageFilter
from .api.pagination import CustomPagination
from django_filters.rest_framework import DjangoFilterBackend

import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)


class ImageCheckViewSet(viewsets.ModelViewSet):  # Not used
    queryset = ImageCheck.objects.all()
    serializer_class = ImageCheckSerializer

    def create(self, request, *args, **kwargs):
        print(f'Received data for /api/checks/: {request.data}')
        return Response({"status": "Received", "data": request.data}, status=status.HTTP_200_OK)

from django.db.models import Exists, OuterRef
class DateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Date.objects.all()
    serializer_class = DateSerializer

    def get_queryset(self):
        machine_names = self.request.query_params.get('machine_name', None)
        title_contains = self.request.query_params.get('title_contains', None)

        queryset = Date.objects.all()
        if machine_names:
            machine_names = machine_names.split(',')
            machines = Machine.objects.filter(name__in=machine_names)
            if machines.exists():
                queryset = queryset.annotate(
                    has_image=Exists(
                        Image.objects.filter(
                            machine__in=machines,
                            date=OuterRef('pk')
                        )
                    )
                ).filter(has_image=True)

        if title_contains:
            queryset = queryset.filter(
                id__in=Image.objects.filter(
                    title__icontains=title_contains,
                    date__in=queryset
                ).values_list('date_id', flat=True)
            )

        return queryset

    
from django.contrib.auth.models import User
class CorrectionViewSet(SortMixin, viewsets.ModelViewSet):
    queryset = Correction.objects.all().order_by('-id')
    pagination_class = CustomPagination
    filter_backends = (DjangoFilterBackend,)
    serializer_class = CorrectionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        # Prepare a success message and include additional data if needed
        response_data = {
            'message': 'Correction created successfully!',
            'correction': serializer.data  # include the serialized data of the newly created Correction
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

from django_filters import rest_framework as filters

class ImageFilter(filters.FilterSet):
    date = filters.DateFilter(field_name="date__date", lookup_expr='exact')
    # end_date = filters.DateFilter(field_name="date", lookup_expr='lte')

    class Meta:
        model = Image
        fields = ['date']


class ImageViewSet(SortMixin, viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    pagination_class = CustomPagination
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ImageFilter

    def get_serializer_class(self):
        # If you need to use different serializers for different actions,
        # you can override this method to return the appropriate one.
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        # Overriding the create method to handle nested data.
        # This example assumes that the request data is structured properly
        # according to the nested serializer.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()  # This will call create on the nested serializer as well.

    def list(self, request, *args, **kwargs):
        import time
        start_time = time.time()
        queryset = self.filter_queryset(self.get_queryset())

        # Check if pagination should be applied
        if 'no_page' in request.query_params:
            
            serializer = self.get_serializer(queryset, many=True)
            end_time = time.time()
            logger.debug(f"API Call Duration: {end_time - start_time:.4f} seconds")
            return Response(serializer.data)
        else:
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

class MetricViewSet(viewsets.ModelViewSet):
    queryset = Metric.objects.all().order_by('-id')  # Ordering by ID in descending order
    pagination_class = CustomPagination
    serializer_class = MetricSerializer
    # pagination_class = CustomPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Check if pagination should be applied
        if 'no_page' in request.query_params:
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
# endregion


from django.http import JsonResponse
from .tasks import initiate_workflow

def test_celery(request):
    # Dispatch the Celery task
    result = initiate_workflow.delay()
    # You can wait for the result here or just return a confirmation response
    # result.get()  # Only use this for testing; in production, you'd likely handle this asynchronously
    return JsonResponse({'status': 'Task dispatched!'})

from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.http import JsonResponse
from .models import SessionInstance

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from rest_framework_simplejwt.tokens import RefreshToken
import json
from datetime import timedelta

@csrf_exempt  # Disable CSRF token for simplicity, consider CSRF protection for production
@require_http_methods(["POST"])  # Only allow POST requests to this endpoint
def login_view(request):
    # Authenticate user
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    print("Username: ", username)
    print("Password: ", password)
    user = authenticate(username=username, password=password)
    print("user", user)
    if user is not None:
        login(request, user)
        # Create tokens
        refresh = RefreshToken.for_user(user)

        # Create a new session instance
        session_instance = SessionInstance.objects.create(
            user=user,
            session_key=request.session.session_key,
            login_time=timezone.now(),
            logout_time=timezone.now() + timedelta(minutes=30)
        )

        return JsonResponse({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'session_key': request.session.session_key,
            'message': 'Login successful',
            'is_staff': user.is_staff
        }, status=200)
    else:
        return JsonResponse({'error': 'Invalid Credentials'}, status=400)

@csrf_exempt  # Disable CSRF token for simplicity, consider CSRF protection for production
@require_http_methods(["POST"])  # Only allow POST requests to this endpoint
def logout_view(request):
    print(request.headers)
    data = json.loads(request.body)
    print(data)
    try:
        # session_key = request.session.session_key
        refresh_token = data.get('refresh')
        session_key = data.get('session_key')
        # print(refresh_token, session_key)
        # print("user", request.user)
        token = RefreshToken(refresh_token)
        token.blacklist()

        # Update session instance
        try:
            session_instance = SessionInstance.objects.get(session_key=session_key)
            session_instance.logout_time = timezone.now()
            session_instance.save()
        except SessionInstance.DoesNotExist:
            pass  # Handle the case where the session history is not found

        logout(request)
        return JsonResponse({'status': 'logged_out'})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# def login_view(request):
#     # Parse the incoming JSON data
#     import json
#     data = json.loads(request.body)
#     username = data.get('username')
#     password = data.get('password')

#     # Authenticate the user
#     user = authenticate(request, username=username, password=password)
#     if user is not None:
#         login(request, user)
        
#         # Attempt to retrieve an existing API key
#         api_key, created = APIKey.objects.get_or_create(name=str(user.id), defaults={'name': str(user.id)})
#         if not created and api_key.created + datetime.timedelta(days=1) > now():
#             # Key is still valid
#             key = api_key.key
#         else:
#             # Key is expired or needs to be created, regenerate and save
#             api_key.delete()  # Remove the old key
#             api_key = APIKey.objects.create(name=str(user.id))  # Create a new key
#             # TODO: add a 24-hour expiry to the key 
#             key = api_key.key

#         return JsonResponse({
#             'message': 'Login successful',
#             'user_id': user.id,
#             'api_key': key
#         }, status=200)

#     else:
#         return JsonResponse({'message': 'Invalid credentials'}, status=401)

# def logout_view(request):
#     session_key = request.session.session_key
#     user = request.user
#     logout(request)  # This clears the session from Django's perspective
#     try:
#         session_history = SessionInstance.objects.get(session_key=session_key)
#         session_history.logout_time = timezone.now()
#         session_history.save()
#     except SessionInstance.DoesNotExist:
#         pass  # Handle the case where the session history is not found
#     # Revoke the API key
#     try:
#         # Assuming each user has a unique API key associated with their account
#         api_key = APIKey.objects.get(name=str(user.id), revoked=False)
#         api_key.revoked = True  # Mark the API key as revoked
#         api_key.save()
#     except APIKey.DoesNotExist:
#         pass  # API key not found or already revoked; handle as needed
#     return JsonResponse({'status': 'logged_out'})


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({'user_id': self.user.id, 'email': self.user.email})  # Add custom data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


from rest_framework_simplejwt.views import TokenRefreshView

from django.core.exceptions import MultipleObjectsReturned
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)  # Get the standard refresh response
        data = response.data
        try:
            # Assuming you want to update the session instance with the latest login_time
            session_instance = SessionInstance.objects.filter(user=request.user).order_by('-login_time').first()
            if session_instance:
                session_instance.logout_time = timezone.now() + timedelta(minutes=30)  # Extend logout time
                session_instance.save()

            # Optional: Add user info to response
            if request.user.is_authenticated:
                data['user_info'] = {
                    'username': request.user.username,
                    'email': request.user.email
                }
        except MultipleObjectsReturned:
            return Response({'error': 'Multiple session instances found.'}, status=400)

        return Response(data)

from django.http import JsonResponse
from .tasks import check_directories_and_initiate_workflows

def run_task_view(request):
    # Triggering the Celery task
    task = check_directories_and_initiate_workflows.delay()
    # Returning a JSON response with the task id and state
    return JsonResponse({'task_id': task.id, 'status': task.status})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    pagination_class = CustomPagination
    serializer_class = UserSerializer

class SessionInstanceViewSet(viewsets.ModelViewSet):
    queryset = SessionInstance.objects.all()
    serializer_class = SessionInstanceSerializer


import datetime, random
def get_dummy_metrics(request):
    now = datetime.datetime.now()
    dummy_data = [
        {
            "image_id": 1,
            "accuracy": round(0.7 + random.uniform(-0.1, 0.1), 2),
            "user_agreement": round(0.8 + random.uniform(-0.1, 0.1), 2),
            "timestamp": (now - datetime.timedelta(hours=i)).isoformat()
        }
        for i in range(24)  # Generate dummy data for the past 24 hours
    ]
    return JsonResponse(dummy_data, safe=False)

from django.views.decorators.http import require_POST
@require_POST
def trigger_check_directory(request):
    task = check_directories_and_initiate_workflows.delay()  # Trigger the Celery task
    return JsonResponse({"status": "Task started", "task_id": task.id})

from .tasks import calculate_metrics
@require_POST
def trigger_calculate_metrics(request):
    task = calculate_metrics.delay()  # Trigger the Celery task
    return JsonResponse({"status": "Task started", "task_id": task.id})

from django.middleware.csrf import get_token
def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})


# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from django.middleware.csrf import get_token
# import logging

# logger = logging.getLogger(__name__)

# @csrf_exempt  # Only use this for debugging; remove it in production
# def trigger_calculate_metrics(request):
#     # Log the received CSRF token from the request headers
#     csrf_token_header = request.META.get('HTTP_X_CSRFTOKEN')
#     logger.debug(f"CSRF token from header: {csrf_token_header}")

#     # Log the CSRF token from the cookies
#     csrf_token_cookie = request.COOKIES.get('csrftoken')
#     logger.debug(f"CSRF token from cookies: {csrf_token_cookie}")

#     # Verify CSRF tokens (this part is usually handled by Django's CSRF middleware)
#     if csrf_token_header != csrf_token_cookie:
#         logger.error("CSRF token mismatch")
#         return JsonResponse({'error': 'CSRF token mismatch'}, status=403)

#     # Simulate task start for debugging
#     return JsonResponse({'status': 'Task started successfully'})
