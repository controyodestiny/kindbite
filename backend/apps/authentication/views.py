"""
Authentication views for KindBite.
Clean, secure authentication endpoints.
"""
import os
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from apps.users.models import User
from apps.users.serializers import UserDetailSerializer
from .serializers import (
    KindBiteTokenObtainPairSerializer, LoginSerializer, RegisterSerializer,
    PasswordChangeSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer, GoogleAuthSerializer
)


class KindBiteTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token obtain view with user data.
    """
    serializer_class = KindBiteTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        """Enhanced login response with user data."""
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.user
            
            # Add user data to response
            user_serializer = UserDetailSerializer(user)
            response.data['user'] = user_serializer.data
            response.data['message'] = f'Welcome back, {user.get_full_name()}!'
        
        return response


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """
    User registration endpoint.
    """
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate tokens for immediate login
        refresh = RefreshToken.for_user(user)
        
        # Prepare response data
        user_data = UserDetailSerializer(user).data
        
        return Response({
            'message': f'Welcome to KindBite, {user.get_full_name()}!',
            'user': user_data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """
    Logout endpoint that blacklists the refresh token.
    """
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        logout(request)
        return Response({
            'message': 'Successfully logged out.'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'Invalid token or logout failed.'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """
    Change password endpoint.
    """
    serializer = PasswordChangeSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully.'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    """
    Password reset request endpoint.
    """
    serializer = PasswordResetRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        user = User.objects.get(email=email, is_active=True)
        
        # Generate password reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # In a real application, you would send an email here
        # For now, we'll return the token (remove this in production)
        reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"
        
        # TODO: Send email with reset link
        # send_mail(
        #     'KindBite Password Reset',
        #     f'Click here to reset your password: {reset_url}',
        #     settings.DEFAULT_FROM_EMAIL,
        #     [email],
        #     fail_silently=False,
        # )
        
        return Response({
            'message': 'Password reset email sent.',
            'reset_url': reset_url  # Remove this in production
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_confirm(request):
    """
    Password reset confirmation endpoint.
    """
    serializer = PasswordResetConfirmSerializer(data=request.data)
    
    if serializer.is_valid():
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        # Extract UID from token (this is simplified - in production, handle this properly)
        try:
            # You would get uid from the URL in a real application
            uid = request.data.get('uid')
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                
                return Response({
                    'message': 'Password reset successfully.'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid or expired token.'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                'error': 'Invalid token.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    """
    Get current user profile.
    """
    serializer = UserDetailSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def auth_status(request):
    """
    Check authentication status.
    """
    if request.user.is_authenticated:
        user_data = UserDetailSerializer(request.user).data
        return Response({
            'is_authenticated': True,
            'user': user_data
        })
    
    return Response({
        'is_authenticated': False,
        'user': None
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def google_auth_url(request):
    """
    Get Google OAuth authorization URL.
    """
    import urllib.parse
    
    google_client_id = os.environ.get('GOOGLE_CLIENT_ID', '')
    # Redirect to frontend, which will extract the code and send it to backend
    redirect_uri = os.environ.get('GOOGLE_REDIRECT_URI', 'https://kindbite.pythonanywhere.com/')
    
    if not google_client_id:
        return Response({
            'error': 'Google OAuth is not configured.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Build Google OAuth URL
    params = {
        'client_id': google_client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'openid email profile',
        'access_type': 'offline',
        'prompt': 'consent',
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    
    return Response({
        'auth_url': auth_url
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth_callback(request):
    """
    Handle Google OAuth callback and authenticate user.
    """
    import requests
    
    google_client_id = os.environ.get('GOOGLE_CLIENT_ID', '')
    google_client_secret = os.environ.get('GOOGLE_CLIENT_SECRET', '')
    # Note: This should match the redirect_uri used in google_auth_url
    redirect_uri = os.environ.get('GOOGLE_REDIRECT_URI', 'https://kindbite.pythonanywhere.com/')
    
    if not google_client_id or not google_client_secret:
        return Response({
            'error': 'Google OAuth is not configured.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Get authorization code from request
    code = request.data.get('code')
    if not code:
        return Response({
            'error': 'Authorization code is required.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Exchange authorization code for access token
    token_url = 'https://oauth2.googleapis.com/token'
    token_data = {
        'code': code,
        'client_id': google_client_id,
        'client_secret': google_client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code',
    }
    
    try:
        token_response = requests.post(token_url, data=token_data)
        token_response.raise_for_status()
        token_json = token_response.json()
        access_token = token_json.get('access_token')
        
        if not access_token:
            return Response({
                'error': 'Failed to get access token from Google.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user info from Google
        user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        headers = {'Authorization': f'Bearer {access_token}'}
        user_info_response = requests.get(user_info_url, headers=headers)
        user_info_response.raise_for_status()
        user_info = user_info_response.json()
        
        # Extract user information
        email = user_info.get('email')
        first_name = user_info.get('given_name', '')
        last_name = user_info.get('family_name', '')
        profile_picture = user_info.get('picture', '')
        
        if not email:
            return Response({
                'error': 'Email not provided by Google.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create user
        try:
            user = User.objects.get(email=email)
            created = False
        except User.DoesNotExist:
            # Create new user using the manager (handles password properly)
            # Generate a random password for OAuth users (they'll use Google to login)
            import secrets
            random_password = secrets.token_urlsafe(32)
            user = User.objects.create_user(
                email=email,
                password=random_password,  # Random password, user won't use it
                first_name=first_name,
                last_name=last_name,
                profile_image=profile_picture,
                is_active=True,
                phone='+0000000000',  # Default phone, user can update later
                location='Unknown',  # Default location, user can update later
            )
            created = True
        
        # Update user info if user already exists
        if not created:
            if first_name and not user.first_name:
                user.first_name = first_name
            if last_name and not user.last_name:
                user.last_name = last_name
            if profile_picture and not user.profile_image:
                user.profile_image = profile_picture
            user.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Prepare response data
        user_data = UserDetailSerializer(user).data
        
        return Response({
            'message': f'Welcome {"back" if not created else "to KindBite"}, {user.get_full_name()}!',
            'user': user_data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'created': created
        }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)
        
    except requests.RequestException as e:
        return Response({
            'error': f'Failed to authenticate with Google: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)































