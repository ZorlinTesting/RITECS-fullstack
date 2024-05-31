from django.urls import path
# from .views import ItemList, ItemDetail, home_view

# urlpatterns = [
#     path('items/', ItemList.as_view(), name='item-list'),
#     path('items/<int:pk>/', ItemDetail.as_view(), name='item-detail'),

#     #test
#     path('', home_view, name='home'),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImageViewSet, ImageCheckViewSet, DateViewSet, CorrectionViewSet, UserViewSet, SessionInstanceViewSet, MetricViewSet ## , SegmentationViewSet, ImageMetadataViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'images', ImageViewSet)
router.register(r'corrections', CorrectionViewSet)
router.register(r'dates', DateViewSet)
router.register(r'users', UserViewSet)
router.register(r'sessions', SessionInstanceViewSet)
router.register(r'metrics', MetricViewSet)

from .views import test_celery, run_task_view, login_view, logout_view
from .views import CustomTokenObtainPairView, CustomTokenRefreshView
# from rest_framework_simplejwt.views import TokenRefreshView

from .views import get_dummy_metrics, trigger_check_directory, trigger_calculate_metrics
from .views import get_csrf_token

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('test-celery/', test_celery, name='test-celery'),
    path('run-task/', run_task_view, name='run-task'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('tokens/refresh', CustomTokenRefreshView.as_view(), name='token_refresh'),
    # path('metrics/', get_dummy_metrics, name='get_dummy_metrics'),
    path('start-metrics-task/', trigger_calculate_metrics, name='trigger_calculate_metrics'),
    path('start-check-task/', trigger_check_directory, name='trigger_check_directory'),
    path('csrf-token/', get_csrf_token),

]

