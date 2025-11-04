"""
Authentication serializers for KindBite.
Clean, secure authentication handling.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from apps.users.models import User
from apps.users.serializers import UserCreateSerializer


class KindBiteTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer with additional user info.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['user_role'] = user.user_role
        token['full_name'] = user.get_full_name()
        token['kind_coins'] = user.kind_coins
        
        return token
    
    def validate(self, attrs):
        """Custom validation with better error messages."""
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )
            
            if not user:
                raise serializers.ValidationError(
                    'Invalid email or password.',
                    code='authorization'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is disabled.',
                    code='authorization'
                )
            
            attrs['user'] = user
            return super().validate(attrs)
        
        raise serializers.ValidationError(
            'Must include "email" and "password".',
            code='authorization'
        )


class LoginSerializer(serializers.Serializer):
    """
    Login serializer for email/password authentication.
    """
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, data):
        """Validate credentials."""
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError(
                        'User account is disabled.'
                    )
                data['user'] = user
                return data
            else:
                raise serializers.ValidationError(
                    'Invalid email or password.'
                )
        else:
            raise serializers.ValidationError(
                'Must provide email and password.'
            )


class RegisterSerializer(UserCreateSerializer):
    """
    Registration serializer extending UserCreateSerializer.
    """
    class Meta(UserCreateSerializer.Meta):
        pass
    
    def validate_email(self, value):
        """Check if email is already registered."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'A user with this email already exists.'
            )
        return value


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change.
    """
    old_password = serializers.CharField(style={'input_type': 'password'})
    new_password = serializers.CharField(style={'input_type': 'password'}, min_length=6)
    confirm_new_password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, data):
        """Validate password change."""
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError(
                'New passwords do not match.'
            )
        return data
    
    def validate_old_password(self, value):
        """Validate old password."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                'Old password is incorrect.'
            )
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for password reset request.
    """
    email = serializers.EmailField()
    
    def validate_email(self, value):
        """Check if user exists."""
        try:
            User.objects.get(email=value, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                'No active user found with this email address.'
            )
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for password reset confirmation.
    """
    token = serializers.CharField()
    new_password = serializers.CharField(style={'input_type': 'password'}, min_length=6)
    confirm_new_password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, data):
        """Validate password reset confirmation."""
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError(
                'Passwords do not match.'
            )
        return data






























