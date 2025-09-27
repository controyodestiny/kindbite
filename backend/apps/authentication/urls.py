"""
Authentication URL patterns.
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    KindBiteTokenObtainPairView, register, logout_view,
    change_password, password_reset_request, password_reset_confirm,
    user_profile, auth_status
)

urlpatterns = [
    # Authentication
    path('login/', KindBiteTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register, name='register'),
    path('logout/', logout_view, name='logout'),
    
    # Password management
    path('password/change/', change_password, name='password_change'),
    path('password/reset/', password_reset_request, name='password_reset_request'),
    path('password/reset/confirm/', password_reset_confirm, name='password_reset_confirm'),
    
    # User info
    path('me/', user_profile, name='user_profile'),
    path('status/', auth_status, name='auth_status'),
]




