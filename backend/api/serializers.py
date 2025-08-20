from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    User, Provider, FoodCategory, DietaryTag, FoodListing, 
    EnvironmentalImpact, Reservation, Review, Notification, 
    AIChat, UserImpact
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'role', 'role_display',
            'phone_number', 'address', 'latitude', 'longitude', 'kind_coins', 
            'profile_picture', 'bio', 'is_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'kind_coins']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'confirm_password', 'first_name', 
            'last_name', 'role', 'phone_number', 'address'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return attrs


class ProviderSerializer(serializers.ModelSerializer):
    """Serializer for Provider model"""
    user = UserSerializer(read_only=True)
    provider_type_display = serializers.CharField(source='get_provider_type_display', read_only=True)
    
    class Meta:
        model = Provider
        fields = [
            'id', 'user', 'provider_type', 'provider_type_display', 'business_name',
            'business_description', 'business_license', 'business_address', 
            'business_phone', 'business_email', 'business_hours', 'rating',
            'total_ratings', 'is_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'rating', 'total_ratings', 'created_at', 'updated_at']


class ProviderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Provider"""
    
    class Meta:
        model = Provider
        fields = [
            'provider_type', 'business_name', 'business_description', 'business_license',
            'business_address', 'business_phone', 'business_email', 'business_hours'
        ]


class FoodCategorySerializer(serializers.ModelSerializer):
    """Serializer for FoodCategory model"""
    
    class Meta:
        model = FoodCategory
        fields = ['id', 'name', 'description', 'icon', 'created_at']


class DietaryTagSerializer(serializers.ModelSerializer):
    """Serializer for DietaryTag model"""
    
    class Meta:
        model = DietaryTag
        fields = ['id', 'name', 'description', 'color', 'created_at']


class EnvironmentalImpactSerializer(serializers.ModelSerializer):
    """Serializer for EnvironmentalImpact model"""
    
    class Meta:
        model = EnvironmentalImpact
        fields = [
            'id', 'co2_saved_kg', 'water_saved_liters', 'packaging_reduced_kg',
            'food_miles_cut_km', 'landfill_waste_prevented_kg', 'created_at'
        ]


class FoodListingSerializer(serializers.ModelSerializer):
    """Serializer for FoodListing model"""
    provider = ProviderSerializer(read_only=True)
    category = FoodCategorySerializer(read_only=True)
    dietary_tags = DietaryTagSerializer(many=True, read_only=True)
    environmental_impact = EnvironmentalImpactSerializer(read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    is_free = serializers.ReadOnlyField()
    
    class Meta:
        model = FoodListing
        fields = [
            'id', 'provider', 'category', 'name', 'description', 'original_price',
            'discounted_price', 'quantity', 'available_quantity', 'unit',
            'pickup_window_start', 'pickup_window_end', 'pickup_address',
            'dietary_tags', 'status', 'rating', 'total_ratings', 'image_url',
            'is_featured', 'discount_percentage', 'is_free', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'provider', 'rating', 'total_ratings', 'created_at', 'updated_at']


class FoodListingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating FoodListing"""
    
    class Meta:
        model = FoodListing
        fields = [
            'category', 'name', 'description', 'original_price', 'discounted_price',
            'quantity', 'available_quantity', 'unit', 'pickup_window_start',
            'pickup_window_end', 'pickup_address', 'dietary_tags', 'image_url'
        ]


class ReservationSerializer(serializers.ModelSerializer):
    """Serializer for Reservation model"""
    user = UserSerializer(read_only=True)
    food_listing = FoodListingSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Reservation
        fields = [
            'id', 'user', 'food_listing', 'quantity', 'status', 'status_display',
            'pickup_time', 'special_instructions', 'kind_coins_earned',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'food_listing', 'kind_coins_earned', 'created_at', 'updated_at']


class ReservationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Reservation"""
    
    class Meta:
        model = Reservation
        fields = ['food_listing', 'quantity', 'pickup_time', 'special_instructions']


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model"""
    user = UserSerializer(read_only=True)
    food_listing = FoodListingSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'food_listing', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'food_listing', 'created_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Review"""
    
    class Meta:
        model = Review
        fields = ['food_listing', 'rating', 'comment']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'notification_type_display', 'title', 'message',
            'is_read', 'related_object_id', 'related_object_type', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AIChatSerializer(serializers.ModelSerializer):
    """Serializer for AIChat model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = AIChat
        fields = ['id', 'user', 'message', 'response', 'is_user_message', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class AIChatCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating AIChat"""
    
    class Meta:
        model = AIChat
        fields = ['message']


class UserImpactSerializer(serializers.ModelSerializer):
    """Serializer for UserImpact model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserImpact
        fields = [
            'id', 'user', 'date', 'meals_saved', 'co2_prevented_kg', 'water_saved_liters',
            'packaging_reduced_kg', 'food_miles_cut_km', 'kind_coins_earned', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class FoodSearchSerializer(serializers.Serializer):
    """Serializer for food search parameters"""
    search_term = serializers.CharField(required=False, allow_blank=True)
    category = serializers.IntegerField(required=False)
    provider_type = serializers.CharField(required=False)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    min_rating = serializers.DecimalField(max_digits=3, decimal_places=2, required=False)
    dietary_tags = serializers.ListField(child=serializers.IntegerField(), required=False)
    distance_km = serializers.DecimalField(max_digits=6, decimal_places=2, required=False)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False)


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_food_listings = serializers.IntegerField()
    total_reservations = serializers.IntegerField()
    total_users = serializers.IntegerField()
    total_providers = serializers.IntegerField()
    total_co2_saved = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_water_saved = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_meals_saved = serializers.IntegerField() 