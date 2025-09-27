from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal


class User(AbstractUser):
    """Custom user model for KindBite application"""
    ROLE_CHOICES = [
        ('end_user', 'End User'),
        ('restaurant', 'Restaurant'),
        ('home_kitchen', 'Home Kitchen'),
        ('factory', 'Food Factory'),
        ('supermarket', 'Supermarket'),
        ('retail', 'Retail Shop'),
        ('verifier', 'Food Verifier'),
        ('ambassador', 'Food Ambassador'),
        ('donor', 'Donor'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='end_user')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    kind_coins = models.PositiveIntegerField(default=0)
    profile_picture = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Provider(models.Model):
    """Food provider information"""
    PROVIDER_TYPES = [
        ('restaurant', 'Restaurant'),
        ('home_kitchen', 'Home Kitchen'),
        ('factory', 'Food Factory'),
        ('supermarket', 'Supermarket'),
        ('retail', 'Retail Shop'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='provider_profile')
    provider_type = models.CharField(max_length=20, choices=PROVIDER_TYPES)
    business_name = models.CharField(max_length=200)
    business_description = models.TextField(blank=True, null=True)
    business_license = models.CharField(max_length=100, blank=True, null=True)
    business_address = models.TextField()
    business_phone = models.CharField(max_length=15)
    business_email = models.EmailField()
    business_hours = models.JSONField(default=dict)  # Store business hours as JSON
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_ratings = models.PositiveIntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'providers'
    
    def __str__(self):
        return f"{self.business_name} ({self.get_provider_type_display()})"


class FoodCategory(models.Model):
    """Food categories for better organization"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)  # Emoji or icon identifier
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'food_categories'
        verbose_name_plural = 'Food Categories'
    
    def __str__(self):
        return self.name


class DietaryTag(models.Model):
    """Dietary restriction tags"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=7, default='#6B7280')  # Hex color code
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'dietary_tags'
    
    def __str__(self):
        return self.name


class FoodListing(models.Model):
    """Food items available for rescue"""
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('claimed', 'Claimed'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]
    
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE, related_name='food_listings')
    category = models.ForeignKey(FoodCategory, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    quantity = models.PositiveIntegerField()
    available_quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=20, default='plates')  # plates, kg, pieces, etc.
    pickup_window_start = models.DateTimeField()
    pickup_window_end = models.DateTimeField()
    pickup_address = models.TextField()
    dietary_tags = models.ManyToManyField(DietaryTag, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_ratings = models.PositiveIntegerField(default=0)
    image_url = models.URLField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'food_listings'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} from {self.provider.business_name}"
    
    @property
    def discount_percentage(self):
        if self.original_price > 0:
            return ((self.original_price - self.discounted_price) / self.original_price) * 100
        return 0
    
    @property
    def is_free(self):
        return self.discounted_price == 0


class EnvironmentalImpact(models.Model):
    """Track environmental impact of food rescue"""
    food_listing = models.OneToOneField(FoodListing, on_delete=models.CASCADE, related_name='environmental_impact')
    co2_saved_kg = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    water_saved_liters = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    packaging_reduced_kg = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    food_miles_cut_km = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    landfill_waste_prevented_kg = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'environmental_impacts'
    
    def __str__(self):
        return f"Environmental impact for {self.food_listing.name}"


class Reservation(models.Model):
    """Food reservations by users"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('picked_up', 'Picked Up'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    food_listing = models.ForeignKey(FoodListing, on_delete=models.CASCADE, related_name='reservations')
    quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    pickup_time = models.DateTimeField()
    special_instructions = models.TextField(blank=True, null=True)
    kind_coins_earned = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reservations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.food_listing.name}"


class Review(models.Model):
    """User reviews for food listings"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    food_listing = models.ForeignKey(FoodListing, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reviews'
        unique_together = ['user', 'food_listing']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.food_listing.name} ({self.rating}/5)"


class Notification(models.Model):
    """User notifications"""
    NOTIFICATION_TYPES = [
        ('reservation_confirmed', 'Reservation Confirmed'),
        ('reservation_cancelled', 'Reservation Cancelled'),
        ('new_food_available', 'New Food Available'),
        ('kind_coins_earned', 'KindCoins Earned'),
        ('reminder', 'Pickup Reminder'),
        ('system', 'System Message'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_object_id = models.PositiveIntegerField(blank=True, null=True)
    related_object_type = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class AIChat(models.Model):
    """AI chat messages for user support"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_chats')
    message = models.TextField()
    response = models.TextField()
    is_user_message = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_chats'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.message[:50]}..."


class UserImpact(models.Model):
    """Track user's environmental impact over time"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='impact_records')
    date = models.DateField()
    meals_saved = models.PositiveIntegerField(default=0)
    co2_prevented_kg = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    water_saved_liters = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    packaging_reduced_kg = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    food_miles_cut_km = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    kind_coins_earned = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_impacts'
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.meals_saved} meals saved"
