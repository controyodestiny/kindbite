"""
Custom permissions for KindBite application.
Clean, role-based permission system.
"""
from rest_framework import permissions
from apps.users.models import User


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners to edit their objects.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only to the owner
        return obj.user == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission that allows admins to edit, others to read only.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return (
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.user_role == User.UserRole.ADMIN)
        )


class IsProviderOrReadOnly(permissions.BasePermission):
    """
    Permission for food providers to manage their content.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user.is_authenticated and request.user.is_provider


class IsBusinessUser(permissions.BasePermission):
    """
    Permission for business users only.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.is_business_user
        )


class IsCommunityHelper(permissions.BasePermission):
    """
    Permission for community helpers (verifiers, ambassadors).
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.is_community_helper
        )


class IsVerifiedUser(permissions.BasePermission):
    """
    Permission for verified users only.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.is_verified
        )

