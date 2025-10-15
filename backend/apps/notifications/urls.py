"""
Notification URL patterns for KindBite application.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'templates', views.NotificationTemplateViewSet, basename='notificationtemplate')
router.register(r'list', views.NotificationViewSet, basename='notification')

urlpatterns = [
    # Additional endpoints (put before router to avoid conflicts)
    path('preferences/', views.notification_preferences, name='notification-preferences'),
    path('preferences/update/', views.update_notification_preferences, name='update-notification-preferences'),
    path('send/', views.send_notification, name='send-notification'),
    
    # Include ViewSet routes
    path('', include(router.urls)),
]
