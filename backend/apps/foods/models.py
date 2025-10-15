"""
Food models for KindBite application.
Handles food listings, reservations, and related functionality.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.common.models import BaseModel
from apps.users.models import User


class FoodListing(BaseModel):
    """
    Represents a food listing created by food providers.
    """
    class ProviderType(models.TextChoices):
        RESTAURANT = 'restaurant', 'Restaurant'
        HOME = 'home', 'Home Kitchen'
        FACTORY = 'factory', 'Food Factory'
        SUPERMARKET = 'supermarket', 'Supermarket'
        RETAIL = 'retail', 'Retail Shop'

    class Status(models.TextChoices):
        AVAILABLE = 'available', 'Available'
        RESERVED = 'reserved', 'Reserved'
        COMPLETED = 'completed', 'Completed'
        EXPIRED = 'expired', 'Expired'
        CANCELLED = 'cancelled', 'Cancelled'

    # Basic Information
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_listings')
    restaurant_name = models.CharField(max_length=200, help_text="Name of the restaurant/provider")
    name = models.CharField(max_length=200, help_text="Name of the food item")
    description = models.TextField(help_text="Description of the food item")
    
    # Pricing
    original_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Availability
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    available_quantity = models.PositiveIntegerField(help_text="Remaining quantity available")
    
    # Logistics
    pickup_window_start = models.TimeField(help_text="Pickup window start time")
    pickup_window_end = models.TimeField(help_text="Pickup window end time")
    pickup_date = models.DateField(help_text="Date when food can be picked up")
    
    # Location (Google Maps integration)
    location = models.CharField(max_length=300, help_text="Pickup location address")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, help_text="Latitude coordinate")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, help_text="Longitude coordinate")
    distance = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text="Distance from user in kilometers")
    
    # Categorization
    provider_type = models.CharField(max_length=20, choices=ProviderType.choices)
    dietary_info = models.JSONField(default=list, help_text="Dietary information (Halal, Vegan, etc.)")
    
    # Visual
    image_emoji = models.CharField(max_length=10, default="🍽️", help_text="Emoji representation of food")
    
    # Environmental Impact
    co2_saved = models.DecimalField(max_digits=5, decimal_places=1, default=0.0, help_text="CO2 saved in kg")
    
    # Status and Rating
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.AVAILABLE)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    rating_count = models.PositiveIntegerField(default=0)
    
    # Metadata
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'food_listings'
        verbose_name = 'Food Listing'
        verbose_name_plural = 'Food Listings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['provider_type', 'status']),
            models.Index(fields=['pickup_date', 'status']),
            models.Index(fields=['provider', 'status']),
        ]

    def __str__(self):
        return f"{self.name} from {self.restaurant_name}"

    def save(self, *args, **kwargs):
        # Set available_quantity to quantity on first save
        if not self.pk:
            self.available_quantity = self.quantity
            # Set provider_type based on user role
            if self.provider and self.provider.user_role in ['restaurant', 'home', 'factory', 'supermarket', 'retail']:
                self.provider_type = self.provider.user_role
        super().save(*args, **kwargs)

    @property
    def is_available(self):
        """Check if food item is still available for reservation."""
        return self.status == self.Status.AVAILABLE and self.available_quantity > 0 and self.is_active

    @property
    def discount_percentage(self):
        """Calculate discount percentage."""
        if self.original_price > 0:
            return int((1 - (self.discounted_price / self.original_price)) * 100)
        return 0

    @property
    def pickup_window_display(self):
        """Get formatted pickup window for display."""
        return f"{self.pickup_window_start.strftime('%I:%M %p')} - {self.pickup_window_end.strftime('%I:%M %p')}"


class FoodReservation(BaseModel):
    """
    Represents a reservation made by a food seeker.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        PICKED_UP = 'picked_up', 'Picked Up'
        CANCELLED = 'cancelled', 'Cancelled'
        NO_SHOW = 'no_show', 'No Show'

    food_listing = models.ForeignKey(FoodListing, on_delete=models.CASCADE, related_name='reservations')
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_reservations')
    quantity_reserved = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    
    # Status tracking
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    # Timing
    reserved_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    picked_up_at = models.DateTimeField(null=True, blank=True)
    
    # Communication
    special_instructions = models.TextField(blank=True, help_text="Special instructions from seeker")
    provider_notes = models.TextField(blank=True, help_text="Notes from provider")
    
    # Rewards
    kindcoins_earned = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'food_reservations'
        verbose_name = 'Food Reservation'
        verbose_name_plural = 'Food Reservations'
        ordering = ['-reserved_at']
        unique_together = ['food_listing', 'seeker']  # One reservation per user per listing

    def __str__(self):
        return f"Reservation: {self.seeker.get_full_name()} - {self.food_listing.name}"

    def save(self, *args, **kwargs):
        # Calculate KindCoins on first save
        if not self.pk:
            # Base reward: 10 coins per item + bonus based on CO2 saved
            base_coins = 10 * self.quantity_reserved
            co2_bonus = int(float(self.food_listing.co2_saved) * 5)  # 5 coins per kg CO2 saved
            self.kindcoins_earned = base_coins + co2_bonus
        
        super().save(*args, **kwargs)

    @property
    def total_saved(self):
        """Calculate total amount saved."""
        return (self.food_listing.original_price - self.food_listing.discounted_price) * self.quantity_reserved


class FoodRating(BaseModel):
    """
    Ratings and reviews for food listings.
    """
    food_listing = models.ForeignKey(FoodListing, on_delete=models.CASCADE, related_name='ratings')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_ratings')
    reservation = models.OneToOneField(FoodReservation, on_delete=models.CASCADE, related_name='rating')
    
    # Rating
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review = models.TextField(blank=True, help_text="Optional review text")
    
    # Categories
    food_quality = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    pickup_experience = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    value_for_money = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    # Metadata
    is_verified = models.BooleanField(default=False, help_text="Verified by food verifiers")
    
    class Meta:
        db_table = 'food_ratings'
        verbose_name = 'Food Rating'
        verbose_name_plural = 'Food Ratings'
        ordering = ['-created_at']
        unique_together = ['food_listing', 'reviewer']  # One rating per user per listing

    def __str__(self):
        return f"{self.rating}★ - {self.food_listing.name} by {self.reviewer.get_full_name()}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update food listing's average rating
        self.update_listing_rating()

    def update_listing_rating(self):
        """Update the food listing's average rating."""
        listing = self.food_listing
        ratings = listing.ratings.all()
        if ratings:
            avg_rating = sum(r.rating for r in ratings) / len(ratings)
            listing.rating = round(avg_rating, 1)
            listing.rating_count = len(ratings)
            listing.save(update_fields=['rating', 'rating_count'])


class FoodCategory(BaseModel):
    """
    Categories for food items to help with filtering and search.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    emoji = models.CharField(max_length=10, default="🍽️")
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'food_categories'
        verbose_name = 'Food Category'
        verbose_name_plural = 'Food Categories'
        ordering = ['name']

    def __str__(self):
        return f"{self.emoji} {self.name}"


class FoodImage(BaseModel):
    """
    Images for food listings (when Pillow is available).
    """
    food_listing = models.ForeignKey(FoodListing, on_delete=models.CASCADE, related_name='images')
    image_url = models.CharField(max_length=500, help_text="URL to food image")
    # image = models.ImageField(upload_to='food_images/', blank=True, null=True)  # Enable when Pillow is installed
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'food_images'
        verbose_name = 'Food Image'
        verbose_name_plural = 'Food Images'

    def __str__(self):
        return f"Image for {self.food_listing.name}"