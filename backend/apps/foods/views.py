"""
Food Management API views for KindBite application.
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView, CreateAPIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Q, Sum, Avg, Count
from django.utils import timezone
from datetime import timedelta

from .models import FoodListing, FoodReservation, FoodRating, FoodCategory
from .serializers import (
    FoodListingListSerializer, FoodListingDetailSerializer, 
    FoodListingCreateUpdateSerializer, FoodReservationSerializer,
    CreateReservationSerializer, FoodRatingSerializer, CreateRatingSerializer,
    FoodCategorySerializer, FoodStatsSerializer
)


class FoodListingViewSet(ModelViewSet):
    """
    ViewSet for managing food listings.
    - Food providers can CRUD their own listings
    - Food seekers and admin can view all available listings
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get food listings based on user role and permissions."""
        user = self.request.user
        
        # Admin can see all listings
        if user.user_role == 'admin':
            return FoodListing.objects.all().select_related('provider').prefetch_related('images')
        
        # Food seekers see only available listings from others
        elif user.user_role == 'end-user':
            return FoodListing.objects.filter(
                status='available',
                is_active=True,
                pickup_date__gte=timezone.now().date()
            ).exclude(provider=user).select_related('provider').prefetch_related('images')
        
        # Food providers see their own listings
        else:
            return FoodListing.objects.filter(
                provider=user
            ).select_related('provider').prefetch_related('images')

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return FoodListingListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return FoodListingCreateUpdateSerializer
        else:
            return FoodListingDetailSerializer

    def perform_create(self, serializer):
        """Set the provider to current user when creating."""
        serializer.save(provider=self.request.user)

    def perform_update(self, serializer):
        """Ensure users can only update their own listings."""
        if serializer.instance.provider != self.request.user and self.request.user.user_role != 'admin':
            raise permissions.PermissionDenied("You can only update your own food listings.")
        serializer.save()

    def perform_destroy(self, instance):
        """Ensure users can only delete their own listings."""
        if instance.provider != self.request.user and self.request.user.user_role != 'admin':
            raise permissions.PermissionDenied("You can only delete your own food listings.")
        # Soft delete by setting is_active to False
        instance.is_active = False
        instance.save()

    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available food listings for food seekers."""
        queryset = FoodListing.objects.filter(
            status='available',
            is_active=True,
            pickup_date__gte=timezone.now().date()
        ).select_related('provider').prefetch_related('images')
        
        # Apply filters
        provider_type = request.query_params.get('provider_type')
        if provider_type:
            queryset = queryset.filter(provider_type=provider_type)
        
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(restaurant_name__icontains=search) |
                Q(description__icontains=search)
            )
        
        serializer = FoodListingListSerializer(queryset, many=True)
        return Response(serializer.data)


@method_decorator(csrf_exempt, name='dispatch')
class CreateReservationView(APIView):
    """Create a food reservation."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CreateReservationSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        
        try:
            with transaction.atomic():
                # Create the reservation
                reservation = FoodReservation.objects.create(
                    food_listing=validated_data['food_listing'],
                    seeker=request.user,
                    quantity_reserved=validated_data['quantity_reserved'],
                    special_instructions=validated_data.get('special_instructions', '')
                )
                
                # Update available quantity
                food_listing = validated_data['food_listing']
                food_listing.available_quantity -= validated_data['quantity_reserved']
                
                # Update status if fully reserved
                if food_listing.available_quantity <= 0:
                    food_listing.status = 'reserved'
                
                food_listing.save()

                # Update user's KindCoins
                request.user.kind_coins += reservation.kindcoins_earned
                request.user.save()

                return Response(
                    FoodReservationSerializer(reservation).data,
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            return Response(
                {'error': 'Failed to create reservation. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserReservationsView(ListAPIView):
    """Get user's food reservations."""
    serializer_class = FoodReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get reservations based on user role."""
        user = self.request.user
        
        if user.user_role == 'admin':
            # Admin sees all reservations
            return FoodReservation.objects.all().select_related('food_listing', 'seeker')
        elif user.user_role == 'end-user':
            # Food seekers see their own reservations
            return FoodReservation.objects.filter(seeker=user).select_related('food_listing')
        else:
            # Food providers see reservations for their listings
            return FoodReservation.objects.filter(
                food_listing__provider=user
            ).select_related('food_listing', 'seeker')


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def food_stats(request):
    """Get food statistics for the user."""
    user = request.user
    
    if user.user_role == 'admin':
        # Admin sees global stats
        queryset = FoodListing.objects.all()
        reservations_queryset = FoodReservation.objects.all()
    elif user.user_role == 'end-user':
        # Food seekers see their reservation stats
        queryset = FoodListing.objects.none()  # No listings
        reservations_queryset = FoodReservation.objects.filter(seeker=user)
    else:
        # Food providers see their listing stats
        queryset = FoodListing.objects.filter(provider=user)
        reservations_queryset = FoodReservation.objects.filter(food_listing__provider=user)
    
    # Calculate stats
    total_listings = queryset.count()
    active_listings = queryset.filter(status='available', is_active=True).count()
    total_reservations = reservations_queryset.count()
    completed_reservations = reservations_queryset.filter(status='picked_up').count()
    
    # Environmental impact
    total_co2_saved = reservations_queryset.filter(
        status='picked_up'
    ).aggregate(total=Sum('food_listing__co2_saved'))['total'] or 0
    
    # KindCoins earned
    total_kindcoins_earned = reservations_queryset.filter(
        status='picked_up'
    ).aggregate(total=Sum('kindcoins_earned'))['total'] or 0
    
    # Average rating
    if user.user_role == 'end-user':
        avg_rating = reservations_queryset.filter(
            status='picked_up'
        ).aggregate(avg=Avg('food_listing__rating'))['avg'] or 0
    else:
        avg_rating = queryset.aggregate(avg=Avg('rating'))['avg'] or 0
    
    stats_data = {
        'total_listings': total_listings,
        'active_listings': active_listings,
        'total_reservations': total_reservations,
        'completed_reservations': completed_reservations,
        'total_co2_saved': round(float(total_co2_saved), 2),
        'total_kindcoins_earned': total_kindcoins_earned,
        'average_rating': round(float(avg_rating), 2) if avg_rating else 0
    }
    
    serializer = FoodStatsSerializer(stats_data)
    return Response(serializer.data)