from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'auth', views.AuthViewSet, basename='auth')
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'providers', views.ProviderViewSet, basename='provider')
router.register(r'categories', views.FoodCategoryViewSet, basename='category')
router.register(r'dietary-tags', views.DietaryTagViewSet, basename='dietary-tag')
router.register(r'food-listings', views.FoodListingViewSet, basename='food-listing')
router.register(r'reservations', views.ReservationViewSet, basename='reservation')
router.register(r'reviews', views.ReviewViewSet, basename='review')
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'ai-chat', views.AIChatViewSet, basename='ai-chat')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    
    # New API endpoints
    path('search/food/', views.FoodSearchAPI.as_view(), name='food-search'),
    path('users/statistics/', views.UserStatisticsAPI.as_view(), name='user-statistics'),
    path('providers/analytics/', views.ProviderAnalyticsAPI.as_view(), name='provider-analytics'),
] 