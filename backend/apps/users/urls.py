"""
User URL patterns for KindBite application.
"""
from django.urls import path
from . import views

urlpatterns = [
    # User profile endpoints
    path('profile/', views.user_profile, name='user-profile'),
    path('profile/update/', views.update_profile, name='update-profile'),
    
    # User management endpoints
    path('list/', views.user_list, name='user-list'),
    path('<int:pk>/', views.user_detail, name='user-detail'),
]