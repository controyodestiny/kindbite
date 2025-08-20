from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth import login, logout
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from .models import (
    User, Provider, FoodCategory, DietaryTag, FoodListing, 
    EnvironmentalImpact, Reservation, Review, Notification, 
    AIChat, UserImpact
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    ProviderSerializer, ProviderCreateSerializer, FoodCategorySerializer,
    DietaryTagSerializer, FoodListingSerializer, FoodListingCreateSerializer,
    EnvironmentalImpactSerializer, ReservationSerializer, ReservationCreateSerializer,
    ReviewSerializer, ReviewCreateSerializer, NotificationSerializer,
    AIChatSerializer, AIChatCreateSerializer, UserImpactSerializer,
    FoodSearchSerializer, DashboardStatsSerializer
)


class AuthViewSet(viewsets.ViewSet):
    """Authentication endpoints"""
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """User registration"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """User login"""
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """User logout"""
        logout(request)
        return Response({'message': 'Logout successful'})
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current user profile"""
        if request.user.is_authenticated:
            return Response(UserSerializer(request.user).data)
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


class UserViewSet(viewsets.ModelViewSet):
    """User management endpoints"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user"""
        return Response(UserSerializer(request.user).data)
    
    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def impact(self, request):
        """Get user's environmental impact"""
        impact_records = UserImpact.objects.filter(user=request.user).order_by('-date')
        serializer = UserImpactSerializer(impact_records, many=True)
        return Response(serializer.data)


class ProviderViewSet(viewsets.ModelViewSet):
    """Provider management endpoints"""
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ProviderCreateSerializer
        return ProviderSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_provider(self, request):
        """Get current user's provider profile"""
        try:
            provider = Provider.objects.get(user=request.user)
            return Response(ProviderSerializer(provider).data)
        except Provider.DoesNotExist:
            return Response({'error': 'Provider profile not found'}, status=status.HTTP_404_NOT_FOUND)


class FoodCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Food category endpoints"""
    queryset = FoodCategory.objects.all()
    serializer_class = FoodCategorySerializer
    permission_classes = [permissions.AllowAny]


class DietaryTagViewSet(viewsets.ReadOnlyModelViewSet):
    """Dietary tag endpoints"""
    queryset = DietaryTag.objects.all()
    serializer_class = DietaryTagSerializer
    permission_classes = [permissions.AllowAny]


class FoodListingViewSet(viewsets.ModelViewSet):
    """Food listing endpoints"""
    queryset = FoodListing.objects.filter(status='available').select_related('provider', 'category')
    serializer_class = FoodListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return FoodListingCreateSerializer
        return FoodListingSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Search functionality
        search_term = self.request.query_params.get('search', None)
        if search_term:
            queryset = queryset.filter(
                Q(name__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(provider__business_name__icontains=search_term)
            )
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category_id=category)
        
        # Filter by provider type
        provider_type = self.request.query_params.get('provider_type', None)
        if provider_type:
            queryset = queryset.filter(provider__provider_type=provider_type)
        
        # Filter by price
        max_price = self.request.query_params.get('max_price', None)
        if max_price:
            queryset = queryset.filter(discounted_price__lte=max_price)
        
        # Filter by rating
        min_rating = self.request.query_params.get('min_rating', None)
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        
        # Filter by dietary tags
        dietary_tags = self.request.query_params.getlist('dietary_tags', [])
        if dietary_tags:
            queryset = queryset.filter(dietary_tags__id__in=dietary_tags)
        
        return queryset.distinct()
    
    def perform_create(self, serializer):
        serializer.save(provider=self.request.user.provider_profile)
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Get nearby food listings"""
        lat = request.query_params.get('latitude')
        lng = request.query_params.get('longitude')
        distance = request.query_params.get('distance_km', 10)
        
        if lat and lng:
            # Simple distance calculation (can be improved with PostGIS)
            queryset = self.get_queryset()
            # For now, return all available listings
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        
        return Response({'error': 'Latitude and longitude required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured food listings"""
        queryset = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ReservationViewSet(viewsets.ModelViewSet):
    """Reservation endpoints"""
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'end_user':
            return Reservation.objects.filter(user=self.request.user)
        else:
            # Providers can see reservations for their food listings
            return Reservation.objects.filter(food_listing__provider__user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReservationCreateSerializer
        return ReservationSerializer
    
    def perform_create(self, serializer):
        food_listing = serializer.validated_data['food_listing']
        quantity = serializer.validated_data['quantity']
        
        # Check if food is available
        if food_listing.available_quantity < quantity:
            raise serializers.ValidationError("Not enough food available")
        
        # Update available quantity
        food_listing.available_quantity -= quantity
        food_listing.save()
        
        # Create reservation
        reservation = serializer.save(user=self.request.user)
        
        # Award KindCoins
        self.request.user.kind_coins += 10
        self.request.user.save()
        
        # Create notification
        Notification.objects.create(
            user=self.request.user,
            notification_type='reservation_confirmed',
            title='Reservation Confirmed',
            message=f'Your reservation for {food_listing.name} has been confirmed!'
        )
        
        return reservation


class ReviewViewSet(viewsets.ModelViewSet):
    """Review endpoints"""
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer
    
    def perform_create(self, serializer):
        review = serializer.save(user=self.request.user)
        
        # Update food listing rating
        food_listing = review.food_listing
        reviews = Review.objects.filter(food_listing=food_listing)
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
        food_listing.rating = avg_rating
        food_listing.total_ratings = reviews.count()
        food_listing.save()
        
        return review


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """Notification endpoints"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})


class AIChatViewSet(viewsets.ModelViewSet):
    """AI Chat endpoints"""
    serializer_class = AIChatSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AIChat.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AIChatCreateSerializer
        return AIChatSerializer
    
    def perform_create(self, serializer):
        # Simple AI response (can be enhanced with actual AI integration)
        message = serializer.validated_data['message']
        response = f"I can help you with KindBite! For '{message}', I recommend checking nearby restaurants or connecting with a food ambassador in your area."
        
        # Save user message
        user_chat = AIChat.objects.create(
            user=self.request.user,
            message=message,
            response="",
            is_user_message=True
        )
        
        # Save AI response
        ai_chat = AIChat.objects.create(
            user=self.request.user,
            message="",
            response=response,
            is_user_message=False
        )
        
        return user_chat


class DashboardView(APIView):
    """Dashboard statistics endpoint"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get dashboard statistics"""
        user = request.user
        
        if user.role == 'end_user':
            # End user dashboard
            stats = {
                'total_food_listings': FoodListing.objects.filter(status='available').count(),
                'total_reservations': Reservation.objects.filter(user=user).count(),
                'total_users': User.objects.count(),
                'total_providers': Provider.objects.count(),
                'total_co2_saved': EnvironmentalImpact.objects.aggregate(
                    total=Sum('co2_saved_kg')
                )['total'] or Decimal('0.00'),
                'total_water_saved': EnvironmentalImpact.objects.aggregate(
                    total=Sum('water_saved_liters')
                )['total'] or Decimal('0.00'),
                'total_meals_saved': Reservation.objects.filter(
                    user=user, status='picked_up'
                ).aggregate(total=Sum('quantity'))['total'] or 0
            }
        else:
            # Provider dashboard
            try:
                provider = Provider.objects.get(user=user)
                provider_listings = FoodListing.objects.filter(provider=provider)
                provider_reservations = Reservation.objects.filter(food_listing__provider=provider)
                
                stats = {
                    'total_food_listings': provider_listings.count(),
                    'total_reservations': provider_reservations.count(),
                    'total_users': User.objects.count(),
                    'total_providers': Provider.objects.count(),
                    'total_co2_saved': EnvironmentalImpact.objects.filter(
                        food_listing__provider=provider
                    ).aggregate(total=Sum('co2_saved_kg'))['total'] or Decimal('0.00'),
                    'total_water_saved': EnvironmentalImpact.objects.filter(
                        food_listing__provider=provider
                    ).aggregate(total=Sum('water_saved_liters'))['total'] or Decimal('0.00'),
                    'total_meals_saved': provider_reservations.filter(
                        status='picked_up'
                    ).aggregate(total=Sum('quantity'))['total'] or 0
                }
            except Provider.DoesNotExist:
                stats = {
                    'total_food_listings': 0,
                    'total_reservations': 0,
                    'total_users': User.objects.count(),
                    'total_providers': Provider.objects.count(),
                    'total_co2_saved': Decimal('0.00'),
                    'total_water_saved': Decimal('0.00'),
                    'total_meals_saved': 0
                }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)
