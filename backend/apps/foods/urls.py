"""
URL configuration for Foods app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'foods'

# Create router for ViewSets
router = DefaultRouter()
router.register(r'listings', views.FoodListingViewSet, basename='listings')

urlpatterns = [
    # ViewSet routes
    path('', include(router.urls)),
    
    # Reservation management
    path('reservations/create/', views.CreateReservationView.as_view(), name='create-reservation'),
    path('reservations/', views.UserReservationsView.as_view(), name='user-reservations'),
    
    # Statistics
    path('stats/', views.food_stats, name='food-stats'),
]




