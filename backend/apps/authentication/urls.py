"""
Authentication URL patterns for KindBite application.
"""
from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('login/', views.KindBiteTokenObtainPairView.as_view(), name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token-refresh'),
    path('status/', views.auth_status, name='auth-status'),
    path('me/', views.user_profile, name='current-user'),
    path('change-password/', views.change_password, name='change-password'),
]