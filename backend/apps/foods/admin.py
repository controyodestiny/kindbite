"""
Django admin configuration for Foods models.
"""
from django.contrib import admin
from .models import FoodListing, FoodReservation, FoodRating, FoodCategory, FoodImage


@admin.register(FoodListing)
class FoodListingAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'restaurant_name', 'provider', 'provider_type', 
        'original_price', 'discounted_price', 'quantity', 'available_quantity',
        'status', 'pickup_date', 'rating', 'is_active', 'created_at'
    ]
    list_filter = [
        'provider_type', 'status', 'pickup_date', 'is_active', 
        'created_at', 'provider__user_role'
    ]
    search_fields = [
        'name', 'restaurant_name', 'description', 
        'provider__email', 'provider__first_name', 'provider__last_name'
    ]
    readonly_fields = ['created_at', 'updated_at', 'rating', 'rating_count']
    raw_id_fields = ['provider']
    
    fieldsets = (
        (None, {
            'fields': ('provider', 'name', 'restaurant_name', 'description')
        }),
        ('Pricing', {
            'fields': ('original_price', 'discounted_price')
        }),
        ('Availability', {
            'fields': ('quantity', 'available_quantity', 'status', 'is_active')
        }),
        ('Pickup Details', {
            'fields': ('pickup_date', 'pickup_window_start', 'pickup_window_end', 'location')
        }),
        ('Categorization', {
            'fields': ('provider_type', 'dietary_info', 'image_emoji')
        }),
        ('Environmental Impact', {
            'fields': ('co2_saved',)
        }),
        ('Rating', {
            'fields': ('rating', 'rating_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(FoodReservation)
class FoodReservationAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'seeker', 'food_listing', 'quantity_reserved', 
        'status', 'kindcoins_earned', 'reserved_at'
    ]
    list_filter = ['status', 'reserved_at', 'food_listing__provider_type']
    search_fields = [
        'seeker__email', 'seeker__first_name', 'seeker__last_name',
        'food_listing__name', 'food_listing__restaurant_name'
    ]
    readonly_fields = ['reserved_at', 'confirmed_at', 'picked_up_at', 'kindcoins_earned']
    raw_id_fields = ['food_listing', 'seeker']
    
    fieldsets = (
        (None, {
            'fields': ('food_listing', 'seeker', 'quantity_reserved', 'status')
        }),
        ('Communication', {
            'fields': ('special_instructions', 'provider_notes')
        }),
        ('Rewards', {
            'fields': ('kindcoins_earned',)
        }),
        ('Timestamps', {
            'fields': ('reserved_at', 'confirmed_at', 'picked_up_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(FoodRating)
class FoodRatingAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'food_listing', 'reviewer', 'rating', 
        'food_quality', 'pickup_experience', 'value_for_money',
        'is_verified', 'created_at'
    ]
    list_filter = [
        'rating', 'food_quality', 'pickup_experience', 'value_for_money',
        'is_verified', 'created_at'
    ]
    search_fields = [
        'reviewer__email', 'reviewer__first_name', 'reviewer__last_name',
        'food_listing__name', 'review'
    ]
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['food_listing', 'reviewer', 'reservation']


@admin.register(FoodCategory)
class FoodCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'emoji', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(FoodImage)
class FoodImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'food_listing', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['food_listing__name', 'alt_text']
    raw_id_fields = ['food_listing']