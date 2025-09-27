from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Provider, FoodCategory, DietaryTag, FoodListing, 
    EnvironmentalImpact, Reservation, Review, Notification, 
    AIChat, UserImpact
)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom admin for User model"""
    list_display = ['username', 'email', 'role', 'kind_coins', 'is_verified', 'created_at']
    list_filter = ['role', 'is_verified', 'is_staff', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = UserAdmin.fieldsets + (
        ('KindBite Profile', {
            'fields': ('role', 'phone_number', 'address', 'latitude', 'longitude', 
                      'kind_coins', 'profile_picture', 'bio', 'is_verified')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('KindBite Profile', {
            'fields': ('role', 'phone_number', 'address', 'latitude', 'longitude')
        }),
    )


@admin.register(Provider)
class ProviderAdmin(admin.ModelAdmin):
    """Admin for Provider model"""
    list_display = ['business_name', 'provider_type', 'user', 'rating', 'is_verified', 'created_at']
    list_filter = ['provider_type', 'is_verified', 'created_at']
    search_fields = ['business_name', 'user__username', 'business_email']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Business Information', {
            'fields': ('user', 'provider_type', 'business_name', 'business_description')
        }),
        ('Contact Information', {
            'fields': ('business_address', 'business_phone', 'business_email')
        }),
        ('Business Details', {
            'fields': ('business_license', 'business_hours', 'rating', 'total_ratings')
        }),
        ('Status', {
            'fields': ('is_verified',)
        }),
    )


@admin.register(FoodCategory)
class FoodCategoryAdmin(admin.ModelAdmin):
    """Admin for FoodCategory model"""
    list_display = ['name', 'icon', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(DietaryTag)
class DietaryTagAdmin(admin.ModelAdmin):
    """Admin for DietaryTag model"""
    list_display = ['name', 'color', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(FoodListing)
class FoodListingAdmin(admin.ModelAdmin):
    """Admin for FoodListing model"""
    list_display = [
        'name', 'provider', 'category', 'original_price', 'discounted_price', 
        'available_quantity', 'status', 'rating', 'is_featured', 'created_at'
    ]
    list_filter = ['status', 'is_featured', 'category', 'provider__provider_type', 'created_at']
    search_fields = ['name', 'description', 'provider__business_name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('provider', 'category', 'name', 'description', 'image_url')
        }),
        ('Pricing & Quantity', {
            'fields': ('original_price', 'discounted_price', 'quantity', 'available_quantity', 'unit')
        }),
        ('Pickup Details', {
            'fields': ('pickup_window_start', 'pickup_window_end', 'pickup_address')
        }),
        ('Additional Information', {
            'fields': ('dietary_tags', 'status', 'rating', 'total_ratings', 'is_featured')
        }),
    )
    
    readonly_fields = ['rating', 'total_ratings']


@admin.register(EnvironmentalImpact)
class EnvironmentalImpactAdmin(admin.ModelAdmin):
    """Admin for EnvironmentalImpact model"""
    list_display = [
        'food_listing', 'co2_saved_kg', 'water_saved_liters', 
        'packaging_reduced_kg', 'food_miles_cut_km', 'created_at'
    ]
    list_filter = ['created_at']
    search_fields = ['food_listing__name']
    ordering = ['-created_at']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    """Admin for Reservation model"""
    list_display = [
        'user', 'food_listing', 'quantity', 'status', 'pickup_time', 
        'kind_coins_earned', 'created_at'
    ]
    list_filter = ['status', 'created_at', 'pickup_time']
    search_fields = ['user__username', 'food_listing__name']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Reservation Details', {
            'fields': ('user', 'food_listing', 'quantity', 'status', 'pickup_time')
        }),
        ('Additional Information', {
            'fields': ('special_instructions', 'kind_coins_earned')
        }),
    )


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """Admin for Review model"""
    list_display = ['user', 'food_listing', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['user__username', 'food_listing__name', 'comment']
    ordering = ['-created_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin for Notification model"""
    list_display = [
        'user', 'notification_type', 'title', 'is_read', 'created_at'
    ]
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['user__username', 'title', 'message']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Notification Details', {
            'fields': ('user', 'notification_type', 'title', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'related_object_id', 'related_object_type')
        }),
    )


@admin.register(AIChat)
class AIChatAdmin(admin.ModelAdmin):
    """Admin for AIChat model"""
    list_display = ['user', 'message', 'response', 'is_user_message', 'created_at']
    list_filter = ['is_user_message', 'created_at']
    search_fields = ['user__username', 'message', 'response']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Chat Information', {
            'fields': ('user', 'message', 'response', 'is_user_message')
        }),
    )


@admin.register(UserImpact)
class UserImpactAdmin(admin.ModelAdmin):
    """Admin for UserImpact model"""
    list_display = [
        'user', 'date', 'meals_saved', 'co2_prevented_kg', 
        'water_saved_liters', 'kind_coins_earned'
    ]
    list_filter = ['date', 'created_at']
    search_fields = ['user__username']
    ordering = ['-date']


# Customize admin site
admin.site.site_header = "KindBite Administration"
admin.site.site_title = "KindBite Admin"
admin.site.index_title = "Welcome to KindBite Administration"
