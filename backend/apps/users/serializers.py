"""
User serializers for KindBite application.
Clean, secure serialization for user data.
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, BusinessProfile


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed user information.
    Used in authentication responses and profile views.
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    is_business_user = serializers.BooleanField(read_only=True)
    is_provider = serializers.BooleanField(read_only=True)
    is_community_helper = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'user_role', 'phone', 'location', 'business_name',
            'profile_image', 'kind_coins', 'is_verified', 'is_active',
            'is_business_user', 'is_provider', 'is_community_helper',
            'date_joined', 'last_login'
        ]
        read_only_fields = [
            'id', 'kind_coins', 'is_verified', 'is_active',
            'date_joined', 'last_login'
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information.
    """
    user = UserDetailSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'bio', 'date_of_birth',
            'dietary_preferences', 'notification_preferences',
            'total_meals_saved', 'total_co2_saved', 'total_water_saved',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'total_meals_saved', 'total_co2_saved', 'total_water_saved',
            'created_at', 'updated_at'
        ]


class BusinessProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for business profile information.
    """
    user = UserDetailSerializer(read_only=True)
    
    class Meta:
        model = BusinessProfile
        fields = [
            'id', 'user', 'business_description', 'business_address',
            'business_phone', 'business_email', 'business_license',
            'tax_id', 'verification_documents', 'operating_hours',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for user creation/registration.
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'password', 'password_confirm',
            'user_role', 'phone', 'location', 'business_name'
        ]
    
    def validate(self, attrs):
        """Validate password confirmation."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match.")
        return attrs
    
    def create(self, validated_data):
        """Create a new user."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class UserRegistrationSerializer(UserCreateSerializer):
    """
    Alias for UserCreateSerializer for backward compatibility.
    """
    pass


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user information.
    """
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'location',
            'business_name', 'profile_image'
        ]
    
    def update(self, instance, validated_data):
        """Update user instance."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change.
    """
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        """Validate password change."""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match.")
        return attrs
    
    def validate_old_password(self, value):
        """Validate old password."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value