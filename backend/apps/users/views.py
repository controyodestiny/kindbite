"""
Views for User management.
Clean, focused views following REST principles.
"""
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import User, UserProfile, BusinessProfile
from .serializers import (
    UserSerializer, UserDetailSerializer, UserProfileSerializer,
    BusinessProfileSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User model with role-based permissions.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter users based on permissions."""
        if self.request.user.is_staff or self.request.user.user_role == User.UserRole.ADMIN:
            return User.objects.filter(is_deleted=False)
        
        # Regular users can only see providers and themselves
        return User.objects.filter(
            is_deleted=False,
            user_role__in=[
                User.UserRole.RESTAURANT,
                User.UserRole.HOME,
                User.UserRole.FACTORY,
                User.UserRole.SUPERMARKET,
                User.UserRole.RETAIL
            ]
        )
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'retrieve':
            return UserDetailSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile."""
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def update_me(self, request):
        """Update current user's profile."""
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def providers(self, request):
        """Get all food providers."""
        providers = User.objects.filter(
            is_deleted=False,
            user_role__in=[
                User.UserRole.RESTAURANT,
                User.UserRole.HOME,
                User.UserRole.FACTORY,
                User.UserRole.SUPERMARKET,
                User.UserRole.RETAIL
            ]
        )
        
        # Filter by role if specified
        role = request.query_params.get('role')
        if role:
            providers = providers.filter(user_role=role)
        
        # Filter by location if specified
        location = request.query_params.get('location')
        if location:
            providers = providers.filter(location__icontains=location)
        
        serializer = UserSerializer(providers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_kind_coins(self, request, pk=None):
        """Add KindCoins to a user (admin only)."""
        if not (request.user.is_staff or request.user.user_role == User.UserRole.ADMIN):
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        user = get_object_or_404(User, pk=pk)
        amount = request.data.get('amount', 0)
        
        if amount > 0:
            user.kind_coins += amount
            user.save()
            
            return Response({
                'message': f'Added {amount} KindCoins to {user.get_full_name()}',
                'new_balance': user.kind_coins
            })
        
        return Response(
            {'error': 'Amount must be positive'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for UserProfile management.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Users can only access their own profile."""
        if self.request.user.is_staff or self.request.user.user_role == User.UserRole.ADMIN:
            return UserProfile.objects.filter(is_deleted=False)
        return UserProfile.objects.filter(user=self.request.user, is_deleted=False)
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current user's profile."""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def update_my_profile(self, request):
        """Update current user's profile."""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

