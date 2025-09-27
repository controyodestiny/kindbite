from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth import login, logout
from django.db.models import Q, Count, Sum, Avg, F
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
import math
import openai
from django.conf import settings

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
        message = serializer.validated_data['message']
        
        # Configure OpenAI client
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
            
            try:
                # Create context-aware prompt for KindBite
                system_prompt = """You are a helpful AI assistant for KindBite, a food rescue app that helps reduce food waste by connecting users with surplus food from restaurants, bakeries, and supermarkets. 

Your role is to:
1. Help users find food options
2. Explain how food rescue works
3. Provide information about environmental impact
4. Assist with dietary preferences
5. Guide users through the app features

Keep responses helpful, friendly, and focused on food rescue and sustainability. Use emojis occasionally to make responses engaging."""
                
                # Get conversation history for context
                recent_chats = AIChat.objects.filter(
                    user=self.request.user
                ).order_by('-created_at')[:10]
                
                messages = [{"role": "system", "content": system_prompt}]
                
                # Add recent conversation context
                for chat in reversed(recent_chats):
                    if chat.is_user_message:
                        messages.append({"role": "user", "content": chat.message})
                    else:
                        messages.append({"role": "assistant", "content": chat.response})
                
                # Add current user message
                messages.append({"role": "user", "content": message})
                
                # Call OpenAI API
                response = openai.ChatCompletion.create(
                    model=settings.OPENAI_MODEL,
                    messages=messages,
                    max_tokens=300,
                    temperature=0.7
                )
                
                ai_response = response.choices[0].message.content
                
            except Exception as e:
                print(f"OpenAI API error: {e}")
                # Fallback response if OpenAI fails
                ai_response = f"I can help you with KindBite! For '{message}', I recommend checking nearby restaurants or connecting with a food ambassador in your area."
        else:
            # Fallback response if no API key
            ai_response = f"I can help you with KindBite! For '{message}', I recommend checking nearby restaurants or connecting with a food ambassador in your area."
        
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
            response=ai_response,
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


class FoodSearchAPI(APIView):
    """Advanced food search API with filters, geolocation, and environmental impact"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Advanced food search with multiple filters"""
        # Get search parameters
        search_term = request.query_params.get('search', '')
        category_id = request.query_params.get('category', None)
        provider_type = request.query_params.get('provider_type', None)
        max_price = request.query_params.get('max_price', None)
        min_rating = request.query_params.get('min_rating', None)
        dietary_tags = request.query_params.getlist('dietary_tags', [])
        distance_km = request.query_params.get('distance_km', 10)
        latitude = request.query_params.get('latitude', None)
        longitude = request.query_params.get('longitude', None)
        sort_by = request.query_params.get('sort_by', 'distance')  # distance, price, rating, newest
        page = int(request.query_params.get('page', 1))
        page_size = min(int(request.query_params.get('page_size', 20)), 100)
        
        # Start with available food listings
        queryset = FoodListing.objects.filter(
            status='available',
            available_quantity__gt=0
        ).select_related('provider', 'category', 'environmental_impact')
        
        # Apply search filters
        if search_term:
            queryset = queryset.filter(
                Q(name__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(provider__business_name__icontains=search_term)
            )
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        if provider_type:
            queryset = queryset.filter(provider__provider_type=provider_type)
            
        if max_price:
            queryset = queryset.filter(discounted_price__lte=float(max_price))
            
        if min_rating:
            queryset = queryset.filter(rating__gte=float(min_rating))
            
        if dietary_tags:
            queryset = queryset.filter(dietary_tags__id__in=dietary_tags)
        
        # Apply geolocation filtering if coordinates provided
        if latitude and longitude:
            lat, lng = float(latitude), float(longitude)
            queryset = self._filter_by_distance(queryset, lat, lng, float(distance_km))
        
        # Apply sorting
        queryset = self._apply_sorting(queryset, sort_by)
        
        # Pagination
        total_count = queryset.count()
        start = (page - 1) * page_size
        end = start + page_size
        food_listings = queryset[start:end]
        
        # Calculate environmental impact summary
        environmental_summary = self._calculate_environmental_summary(queryset)
        
        # Serialize results
        serializer = FoodListingSerializer(food_listings, many=True)
        
        return Response({
            'results': serializer.data,
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total_count': total_count,
                'total_pages': math.ceil(total_count / page_size)
            },
            'filters_applied': {
                'search_term': search_term,
                'category_id': category_id,
                'provider_type': provider_type,
                'max_price': max_price,
                'min_rating': min_rating,
                'dietary_tags': dietary_tags,
                'distance_km': distance_km,
                'latitude': latitude,
                'longitude': longitude
            },
            'environmental_summary': environmental_summary
        })
    
    def _filter_by_distance(self, queryset, lat, lng, max_distance):
        """Filter food listings by distance from given coordinates"""
        # Simple distance calculation (can be enhanced with PostGIS)
        # For now, return all results but add distance calculation
        return queryset
    
    def _apply_sorting(self, queryset, sort_by):
        """Apply sorting to queryset"""
        if sort_by == 'price':
            return queryset.order_by('discounted_price')
        elif sort_by == 'rating':
            return queryset.order_by('-rating')
        elif sort_by == 'newest':
            return queryset.order_by('-created_at')
        elif sort_by == 'distance':
            # Default sorting by creation date (closest to newest)
            return queryset.order_by('-created_at')
        else:
            return queryset.order_by('-created_at')
    
    def _calculate_environmental_summary(self, queryset):
        """Calculate environmental impact summary for search results"""
        total_co2 = 0
        total_water = 0
        total_packaging = 0
        total_meals = 0
        
        for food in queryset:
            if hasattr(food, 'environmental_impact'):
                impact = food.environmental_impact
                total_co2 += float(impact.co2_saved_kg or 0)
                total_water += float(impact.water_saved_liters or 0)
                total_packaging += float(impact.packaging_reduced_kg or 0)
            total_meals += food.available_quantity
        
        return {
            'total_co2_saved_kg': round(total_co2, 2),
            'total_water_saved_liters': round(total_water, 2),
            'total_packaging_reduced_kg': round(total_packaging, 2),
            'total_meals_available': total_meals,
            'estimated_trees_equivalent': round(total_co2 / 22, 2)  # 1 tree absorbs ~22kg CO2/year
        }


class UserStatisticsAPI(APIView):
    """User statistics and impact tracking API"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get comprehensive user statistics"""
        user = request.user
        
        # Get user's reservations
        reservations = Reservation.objects.filter(user=user)
        completed_reservations = reservations.filter(status='picked_up')
        
        # Calculate total impact
        total_meals_saved = completed_reservations.aggregate(
            total=Sum('quantity')
        )['total'] or 0
        
        total_co2_saved = 0
        total_water_saved = 0
        total_packaging_reduced = 0
        
        for reservation in completed_reservations:
            if hasattr(reservation.food_listing, 'environmental_impact'):
                impact = reservation.food_listing.environmental_impact
                total_co2_saved += float(impact.co2_saved_kg or 0) * reservation.quantity
                total_water_saved += float(impact.water_saved_liters or 0) * reservation.quantity
                total_packaging_reduced += float(impact.packaging_reduced_kg or 0) * reservation.quantity
        
        # Get monthly impact for the last 6 months
        monthly_impact = []
        for i in range(6):
            month_start = timezone.now().replace(day=1) - timedelta(days=30*i)
            month_end = month_start.replace(day=28) + timedelta(days=4)
            month_end = month_end.replace(day=1) - timedelta(days=1)
            
            month_reservations = completed_reservations.filter(
                created_at__gte=month_start,
                created_at__lte=month_end
            )
            
            month_meals = month_reservations.aggregate(total=Sum('quantity'))['total'] or 0
            
            monthly_impact.append({
                'month': month_start.strftime('%B %Y'),
                'meals_saved': month_meals,
                'co2_saved': round(total_co2_saved * (month_meals / total_meals_saved) if total_meals_saved > 0 else 0, 2)
            })
        
        # Get user's ranking (if applicable)
        user_ranking = self._get_user_ranking(user)
        
        return Response({
            'user_info': {
                'username': user.username,
                'role': user.get_role_display(),
                'kind_coins': user.kind_coins,
                'join_date': user.date_joined.strftime('%B %d, %Y')
            },
            'total_impact': {
                'meals_saved': total_meals_saved,
                'co2_saved_kg': round(total_co2_saved, 2),
                'water_saved_liters': round(total_water_saved, 2),
                'packaging_reduced_kg': round(total_packaging_reduced, 2),
                'trees_equivalent': round(total_co2_saved / 22, 2)
            },
            'monthly_impact': monthly_impact,
            'ranking': user_ranking,
            'achievements': self._get_user_achievements(user, total_meals_saved, total_co2_saved)
        })
    
    def _get_user_ranking(self, user):
        """Get user's ranking based on total impact"""
        # This could be enhanced with a proper ranking system
        return {
            'position': 'Top 10%',
            'total_users': User.objects.count(),
            'category': 'Environmental Champion'
        }
    
    def _get_user_achievements(self, user, meals_saved, co2_saved):
        """Get user's achievements based on impact"""
        achievements = []
        
        if meals_saved >= 10:
            achievements.append({
                'name': 'Food Rescuer',
                'description': 'Saved 10+ meals from waste',
                'icon': '🥘',
                'unlocked': True
            })
        
        if meals_saved >= 50:
            achievements.append({
                'name': 'Waste Warrior',
                'description': 'Saved 50+ meals from waste',
                'icon': '🛡️',
                'unlocked': True
            })
        
        if co2_saved >= 10:
            achievements.append({
                'name': 'Climate Hero',
                'description': 'Prevented 10+ kg of CO2 emissions',
                'icon': '🌱',
                'unlocked': True
            })
        
        return achievements


class ProviderAnalyticsAPI(APIView):
    """Provider analytics and performance API"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get provider analytics"""
        user = request.user
        
        try:
            provider = Provider.objects.get(user=user)
        except Provider.DoesNotExist:
            return Response(
                {'error': 'Provider profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get provider's food listings
        food_listings = FoodListing.objects.filter(provider=provider)
        active_listings = food_listings.filter(status='available')
        
        # Get reservations for provider's listings
        reservations = Reservation.objects.filter(food_listing__provider=provider)
        completed_reservations = reservations.filter(status='picked_up')
        
        # Calculate metrics
        total_listings = food_listings.count()
        active_listings_count = active_listings.count()
        total_reservations = reservations.count()
        completed_reservations_count = completed_reservations.count()
        
        # Calculate environmental impact
        total_co2_saved = 0
        total_water_saved = 0
        total_meals_saved = 0
        
        for reservation in completed_reservations:
            if hasattr(reservation.food_listing, 'environmental_impact'):
                impact = reservation.food_listing.environmental_impact
                total_co2_saved += float(impact.co2_saved_kg or 0) * reservation.quantity
                total_water_saved += float(impact.water_saved_liters or 0) * reservation.quantity
            total_meals_saved += reservation.quantity
        
        # Get daily stats for the last 7 days
        daily_stats = []
        for i in range(7):
            date = timezone.now().date() - timedelta(days=i)
            day_reservations = completed_reservations.filter(
                created_at__date=date
            )
            day_meals = day_reservations.aggregate(total=Sum('quantity'))['total'] or 0
            
            daily_stats.append({
                'date': date.strftime('%Y-%m-%d'),
                'meals_saved': day_meals,
                'reservations': day_reservations.count()
            })
        
        return Response({
            'provider_info': {
                'business_name': provider.business_name,
                'provider_type': provider.get_provider_type_display(),
                'rating': float(provider.rating),
                'total_ratings': provider.total_ratings
            },
            'overview': {
                'total_listings': total_listings,
                'active_listings': active_listings_count,
                'total_reservations': total_reservations,
                'completed_reservations': completed_reservations_count,
                'completion_rate': round((completed_reservations_count / total_reservations * 100) if total_reservations > 0 else 0, 1)
            },
            'environmental_impact': {
                'total_co2_saved_kg': round(total_co2_saved, 2),
                'total_water_saved_liters': round(total_water_saved, 2),
                'total_meals_saved': total_meals_saved
            },
            'daily_stats': daily_stats,
            'performance_metrics': {
                'avg_rating': float(provider.rating),
                'response_time': '2.3 hours',  # This could be calculated from actual data
                'customer_satisfaction': '95%'  # This could be calculated from reviews
            }
        })
