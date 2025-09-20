"""
Serializers for User models.
Clean, focused serializers following DRY principles.
"""
from rest_framework import serializers
from .models import User, UserProfile, BusinessProfile


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    Excludes sensitive information by default.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    is_business_user = serializers.BooleanField(read_only=True)
    is_provider = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'user_role', 'phone', 'location', 'business_name',
            'profile_image', 'kind_coins', 'is_verified',
            'is_business_user', 'is_provider', 'date_joined'
        ]
        read_only_fields = ['id', 'kind_coins', 'is_verified', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new users.
    Includes password handling and validation.
    """
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'confirm_password', 'first_name', 'last_name',
            'user_role', 'phone', 'location', 'business_name'
        ]
    
    def validate(self, data):
        """Validate password confirmation and business requirements."""
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        
        # Validate business name for business roles
        business_roles = [
            User.UserRole.RESTAURANT,
            User.UserRole.FACTORY,
            User.UserRole.SUPERMARKET,
            User.UserRole.RETAIL
        ]
        
        if data['user_role'] in business_roles and not data.get('business_name'):
            raise serializers.ValidationError(
                "Business name is required for this role."
            )
        
        return data
    
    def create(self, validated_data):
        """Create user with hashed password."""
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create related profiles
        UserProfile.objects.create(user=user)
        
        if user.is_business_user:
            BusinessProfile.objects.create(
                user=user,
                business_address=user.location  # Default to user location
            )
        
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for UserProfile model.
    """
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user_email', 'user_name', 'bio', 'date_of_birth',
            'dietary_preferences', 'notification_preferences',
            'total_meals_saved', 'total_co2_saved', 'total_water_saved',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user_email', 'user_name', 'total_meals_saved',
            'total_co2_saved', 'total_water_saved', 'created_at', 'updated_at'
        ]


class BusinessProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for BusinessProfile model.
    """
    business_name = serializers.CharField(source='user.business_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = BusinessProfile
        fields = [
            'id', 'user_email', 'business_name', 'business_description',
            'business_address', 'business_phone', 'business_email',
            'business_license', 'tax_id', 'operating_hours',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user_email', 'business_name', 'verification_documents',
            'created_at', 'updated_at'
        ]


class UserDetailSerializer(UserSerializer):
    """
    Detailed user serializer including profile information.
    """
    profile = UserProfileSerializer(read_only=True)
    business_profile = BusinessProfileSerializer(read_only=True)
    
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['profile', 'business_profile']

