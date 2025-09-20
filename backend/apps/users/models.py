"""
User models for KindBite application.
Clean architecture with role-based user system.
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.validators import RegexValidator
from apps.common.models import BaseModel


class UserManager(BaseUserManager):
    """
    Custom user manager for email-based authentication.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, BaseModel):
    """
    Custom User model extending Django's AbstractUser.
    Supports multiple user roles for the KindBite ecosystem.
    """
    
    # Use our custom manager
    objects = UserManager()
    
    class UserRole(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        END_USER = 'end-user', 'Food Seeker'
        RESTAURANT = 'restaurant', 'Restaurant'
        HOME = 'home', 'Home Kitchen'
        FACTORY = 'factory', 'Food Factory'
        SUPERMARKET = 'supermarket', 'Supermarket'
        RETAIL = 'retail', 'Retail Shop'
        VERIFIER = 'verifier', 'Food Verifier'
        AMBASSADOR = 'ambassador', 'Food Ambassador'
        DONOR = 'donor', 'Donor/Buyer'
    
    # Override default fields - remove username, use email instead
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    
    # Custom fields
    user_role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.END_USER
    )
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone = models.CharField(validators=[phone_regex], max_length=17)
    location = models.CharField(max_length=100)
    business_name = models.CharField(max_length=100, blank=True, null=True)
    # profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)  # Disabled until Pillow is installed
    profile_image = models.CharField(max_length=255, blank=True, null=True)  # Temporary: store image URL as string
    kind_coins = models.PositiveIntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Use email as username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone', 'location']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"

    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_business_user(self):
        """Check if user represents a business."""
        business_roles = [
            self.UserRole.RESTAURANT,
            self.UserRole.FACTORY,
            self.UserRole.SUPERMARKET,
            self.UserRole.RETAIL
        ]
        return self.user_role in business_roles

    @property
    def is_provider(self):
        """Check if user can provide food."""
        provider_roles = [
            self.UserRole.RESTAURANT,
            self.UserRole.HOME,
            self.UserRole.FACTORY,
            self.UserRole.SUPERMARKET,
            self.UserRole.RETAIL
        ]
        return self.user_role in provider_roles

    @property
    def is_community_helper(self):
        """Check if user helps with community functions."""
        helper_roles = [
            self.UserRole.VERIFIER,
            self.UserRole.AMBASSADOR
        ]
        return self.user_role in helper_roles


class UserProfile(BaseModel):
    """
    Extended profile information for users.
    Following single responsibility principle.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    
    # Preferences
    dietary_preferences = models.JSONField(default=list, blank=True)
    notification_preferences = models.JSONField(default=dict, blank=True)
    
    # Statistics
    total_meals_saved = models.PositiveIntegerField(default=0)
    total_co2_saved = models.FloatField(default=0.0)  # in kg
    total_water_saved = models.FloatField(default=0.0)  # in liters
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"Profile of {self.user.get_full_name()}"


class BusinessProfile(BaseModel):
    """
    Business-specific profile information.
    Only for users with business roles.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='business_profile')
    business_description = models.TextField(max_length=1000, blank=True)
    business_address = models.TextField(max_length=300)
    business_phone = models.CharField(max_length=17, blank=True)
    business_email = models.EmailField(blank=True)
    
    # Business verification
    business_license = models.CharField(max_length=100, blank=True)
    tax_id = models.CharField(max_length=50, blank=True)
    verification_documents = models.JSONField(default=list, blank=True)
    
    # Operating hours
    operating_hours = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'business_profiles'
        verbose_name = 'Business Profile'
        verbose_name_plural = 'Business Profiles'

    def __str__(self):
        return f"Business Profile of {self.user.business_name or self.user.get_full_name()}"
