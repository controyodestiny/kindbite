"""
Serializers for Food Management API endpoints.
"""
from rest_framework import serializers
from django.utils import timezone
from datetime import datetime, time
from .models import FoodListing, FoodReservation, FoodRating, FoodCategory, FoodImage


class FoodImageSerializer(serializers.ModelSerializer):
    """Serializer for food images."""
    
    class Meta:
        model = FoodImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary']


class FoodListingListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing food items."""
    provider_name = serializers.CharField(source='provider.get_full_name', read_only=True)
    provider_business_name = serializers.CharField(source='provider.business_name', read_only=True)
    pickup_window = serializers.CharField(source='pickup_window_display', read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    is_available = serializers.BooleanField(read_only=True)
    images = FoodImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = FoodListing
        fields = [
            'id', 'name', 'restaurant_name', 'description', 
            'original_price', 'discounted_price', 'discount_percentage',
            'quantity', 'available_quantity', 'pickup_window', 'pickup_date',
            'location', 'distance', 'provider_type', 'dietary_info',
            'image_emoji', 'co2_saved', 'rating', 'rating_count',
            'status', 'is_available', 'created_at',
            'provider_name', 'provider_business_name', 'images'
        ]


class FoodListingDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for individual food listings."""
    provider_name = serializers.CharField(source='provider.get_full_name', read_only=True)
    provider_business_name = serializers.CharField(source='provider.business_name', read_only=True)
    provider_email = serializers.CharField(source='provider.email', read_only=True)
    provider_phone = serializers.CharField(source='provider.phone', read_only=True)
    pickup_window = serializers.CharField(source='pickup_window_display', read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    is_available = serializers.BooleanField(read_only=True)
    images = FoodImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = FoodListing
        fields = [
            'id', 'name', 'restaurant_name', 'description',
            'original_price', 'discounted_price', 'discount_percentage',
            'quantity', 'available_quantity', 'pickup_window_start', 'pickup_window_end',
            'pickup_date', 'location', 'distance', 'provider_type', 'dietary_info',
            'image_emoji', 'co2_saved', 'rating', 'rating_count',
            'status', 'is_available', 'created_at', 'updated_at',
            'provider_name', 'provider_business_name', 'provider_email', 'provider_phone',
            'pickup_window', 'images'
        ]


class FoodListingCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating food listings."""
    
    class Meta:
        model = FoodListing
        fields = [
            'name', 'restaurant_name', 'description',
            'original_price', 'discounted_price', 'quantity',
            'pickup_window_start', 'pickup_window_end', 'pickup_date',
            'location', 'dietary_info', 'image_emoji', 'co2_saved'
        ]

    def validate(self, data):
        """Validate the food listing data."""
        # Validate pricing
        if data.get('discounted_price', 0) > data.get('original_price', 0):
            raise serializers.ValidationError("Discounted price cannot be higher than original price.")
        
        # Validate pickup times
        pickup_start = data.get('pickup_window_start')
        pickup_end = data.get('pickup_window_end')
        if pickup_start and pickup_end and pickup_start >= pickup_end:
            raise serializers.ValidationError("Pickup start time must be before end time.")
        
        # Validate pickup date
        pickup_date = data.get('pickup_date')
        if pickup_date and pickup_date < timezone.now().date():
            raise serializers.ValidationError("Pickup date cannot be in the past.")
        
        return data

    def create(self, validated_data):
        """Create a new food listing."""
        # Set the provider to the current user
        validated_data['provider'] = self.context['request'].user
        return super().create(validated_data)


class FoodReservationSerializer(serializers.ModelSerializer):
    """Serializer for food reservations."""
    food_listing = FoodListingListSerializer(read_only=True)
    seeker_name = serializers.CharField(source='seeker.get_full_name', read_only=True)
    seeker_email = serializers.CharField(source='seeker.email', read_only=True)
    seeker_phone = serializers.CharField(source='seeker.phone', read_only=True)
    total_saved = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = FoodReservation
        fields = [
            'id', 'food_listing', 'quantity_reserved', 'status',
            'reserved_at', 'confirmed_at', 'picked_up_at',
            'special_instructions', 'provider_notes', 'kindcoins_earned',
            'seeker_name', 'seeker_email', 'seeker_phone', 'total_saved'
        ]


class CreateReservationSerializer(serializers.Serializer):
    """Serializer for creating a reservation."""
    food_listing_id = serializers.IntegerField()
    quantity_reserved = serializers.IntegerField(min_value=1)
    special_instructions = serializers.CharField(max_length=500, required=False, allow_blank=True)
    
    def validate(self, data):
        """Validate reservation data."""
        try:
            food_listing = FoodListing.objects.get(id=data['food_listing_id'])
        except FoodListing.DoesNotExist:
            raise serializers.ValidationError("Food listing not found.")
        
        # Check if food is available
        if not food_listing.is_available:
            raise serializers.ValidationError("This food item is no longer available.")
        
        # Check if user already has a reservation for this listing
        user = self.context['request'].user
        existing_reservation = FoodReservation.objects.filter(
            food_listing=food_listing, 
            seeker=user,
            status__in=['pending', 'confirmed']
        ).exists()
        
        if existing_reservation:
            raise serializers.ValidationError("You already have an active reservation for this item.")
        
        # Check if requested quantity is available
        if data['quantity_reserved'] > food_listing.available_quantity:
            raise serializers.ValidationError(
                f"Only {food_listing.available_quantity} items are available."
            )
        
        data['food_listing'] = food_listing
        return data


class FoodRatingSerializer(serializers.ModelSerializer):
    """Serializer for food ratings."""
    reviewer_name = serializers.CharField(source='reviewer.get_full_name', read_only=True)
    food_listing_name = serializers.CharField(source='food_listing.name', read_only=True)
    
    class Meta:
        model = FoodRating
        fields = [
            'id', 'rating', 'review', 'food_quality', 'pickup_experience',
            'value_for_money', 'is_verified', 'created_at',
            'reviewer_name', 'food_listing_name'
        ]


class CreateRatingSerializer(serializers.ModelSerializer):
    """Serializer for creating ratings."""
    
    class Meta:
        model = FoodRating
        fields = [
            'reservation', 'rating', 'review', 'food_quality',
            'pickup_experience', 'value_for_money'
        ]
    
    def validate_reservation(self, value):
        """Validate that user owns the reservation and it's completed."""
        user = self.context['request'].user
        
        if value.seeker != user:
            raise serializers.ValidationError("You can only rate your own reservations.")
        
        if value.status != 'picked_up':
            raise serializers.ValidationError("You can only rate completed reservations.")
        
        # Check if rating already exists
        if hasattr(value, 'rating'):
            raise serializers.ValidationError("You have already rated this reservation.")
        
        return value

    def create(self, validated_data):
        """Create a new rating."""
        validated_data['reviewer'] = self.context['request'].user
        validated_data['food_listing'] = validated_data['reservation'].food_listing
        return super().create(validated_data)


class FoodCategorySerializer(serializers.ModelSerializer):
    """Serializer for food categories."""
    
    class Meta:
        model = FoodCategory
        fields = ['id', 'name', 'description', 'emoji', 'is_active']


class FoodStatsSerializer(serializers.Serializer):
    """Serializer for food statistics."""
    total_listings = serializers.IntegerField()
    active_listings = serializers.IntegerField()
    total_reservations = serializers.IntegerField()
    completed_reservations = serializers.IntegerField()
    total_co2_saved = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_kindcoins_earned = serializers.IntegerField()
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)




