"""
Food URL patterns for KindBite application.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'listings', views.FoodListingViewSet, basename='foodlisting')

urlpatterns = [
    # Include ViewSet routes
    path('', include(router.urls)),
    
    # Additional endpoints
    path('reservations/', views.CreateReservationView.as_view(), name='create-reservation'),
    path('reservations/my/', views.UserReservationsView.as_view(), name='my-reservations'),
    path('reservations/<int:reservation_id>/status/', views.update_reservation_status, name='update-reservation-status'),
    path('stats/', views.food_stats, name='food-stats'),
    path('images/<int:food_listing_id>/upload/', views.upload_food_image, name='upload-food-image'),
    path('images/<int:image_id>/delete/', views.delete_food_image, name='delete-food-image'),
]