"""
Django admin configuration for User models.
Clean, organized admin interface.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, UserProfile, BusinessProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin for User model with role-based organization.
    """
    list_display = (
        'email', 'get_full_name', 'user_role', 'location', 
        'kind_coins', 'is_verified', 'is_active', 'date_joined'
    )
    list_filter = ('user_role', 'is_verified', 'is_active', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name', 'business_name', 'location')
    ordering = ('-date_joined',)
    
    fieldsets = (
        ('Authentication', {
            'fields': ('email', 'password')
        }),
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'phone', 'location', 'profile_image')
        }),
        ('Role & Business', {
            'fields': ('user_role', 'business_name')
        }),
        ('KindBite Stats', {
            'fields': ('kind_coins', 'is_verified')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        ('Create New User', {
            'classes': ('wide',),
            'fields': (
                'email', 'first_name', 'last_name', 'password1', 'password2',
                'phone', 'location', 'user_role', 'business_name'
            ),
        }),
    )
    
    readonly_fields = ('date_joined', 'last_login')
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    get_full_name.short_description = 'Full Name'
    
    def get_queryset(self, request):
        """Filter users based on admin permissions."""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Regular admin users can only see non-admin users
        return qs.exclude(user_role=User.UserRole.ADMIN)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Admin interface for UserProfile.
    """
    list_display = (
        'user', 'user_role', 'total_meals_saved', 
        'total_co2_saved', 'total_water_saved', 'created_at'
    )
    list_filter = ('user__user_role', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'bio')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Profile Info', {
            'fields': ('bio', 'date_of_birth')
        }),
        ('Preferences', {
            'fields': ('dietary_preferences', 'notification_preferences')
        }),
        ('Impact Statistics', {
            'fields': ('total_meals_saved', 'total_co2_saved', 'total_water_saved')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_role(self, obj):
        return obj.user.get_user_role_display()
    user_role.short_description = 'Role'


@admin.register(BusinessProfile)
class BusinessProfileAdmin(admin.ModelAdmin):
    """
    Admin interface for BusinessProfile.
    """
    list_display = (
        'user', 'business_name', 'business_phone', 
        'business_email', 'verification_status', 'created_at'
    )
    list_filter = ('user__user_role', 'created_at')
    search_fields = (
        'user__email', 'user__business_name', 'business_description',
        'business_address', 'business_phone', 'business_email'
    )
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Business Information', {
            'fields': (
                'business_description', 'business_address', 
                'business_phone', 'business_email'
            )
        }),
        ('Verification', {
            'fields': ('business_license', 'tax_id', 'verification_documents')
        }),
        ('Operations', {
            'fields': ('operating_hours',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def business_name(self, obj):
        return obj.user.business_name or 'N/A'
    business_name.short_description = 'Business Name'
    
    def verification_status(self, obj):
        if obj.user.is_verified:
            return format_html('<span style="color: green;">✓ Verified</span>')
        return format_html('<span style="color: red;">✗ Not Verified</span>')
    verification_status.short_description = 'Status'


# Customize admin site header
admin.site.site_header = "KindBite Administration"
admin.site.site_title = "KindBite Admin"
admin.site.index_title = "Welcome to KindBite Administration"

