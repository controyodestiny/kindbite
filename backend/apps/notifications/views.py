"""
Notification views for KindBite application.
Clean, secure notification management endpoints.
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import Notification, NotificationPreference, NotificationTemplate
from .serializers import (
    NotificationSerializer, NotificationCreateSerializer,
    NotificationPreferenceSerializer, NotificationTemplateSerializer,
    NotificationStatsSerializer
)


class NotificationViewSet(ModelViewSet):
    """
    ViewSet for managing notifications.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get notifications for the current user."""
        return Notification.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return NotificationCreateSerializer
        return NotificationSerializer
    
    def perform_create(self, serializer):
        """Set the user to current user when creating."""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read."""
        notification = self.get_object()
        notification.mark_as_read()
        return Response({'message': 'Notification marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read."""
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications."""
        queryset = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get notification statistics."""
        user = request.user
        
        # Basic stats
        total_notifications = Notification.objects.filter(user=user).count()
        unread_notifications = Notification.objects.filter(
            user=user, is_read=False
        ).count()
        
        # Notifications by type
        notifications_by_type = Notification.objects.filter(user=user).values(
            'notification_type'
        ).annotate(count=Count('id'))
        
        # Notifications by priority
        notifications_by_priority = Notification.objects.filter(user=user).values(
            'priority'
        ).annotate(count=Count('id'))
        
        # Recent notifications (last 10)
        recent_notifications = Notification.objects.filter(user=user)[:10]
        
        stats_data = {
            'total_notifications': total_notifications,
            'unread_notifications': unread_notifications,
            'notifications_by_type': {item['notification_type']: item['count'] for item in notifications_by_type},
            'notifications_by_priority': {item['priority']: item['count'] for item in notifications_by_priority},
            'recent_notifications': NotificationSerializer(recent_notifications, many=True).data
        }
        
        serializer = NotificationStatsSerializer(stats_data)
        return Response(serializer.data)


class NotificationPreferenceView(RetrieveUpdateAPIView):
    """
    View for managing notification preferences.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationPreferenceSerializer
    
    def get_object(self):
        """Get or create notification preferences for current user."""
        preferences, created = NotificationPreference.objects.get_or_create(
            user=self.request.user
        )
        return preferences


class NotificationTemplateViewSet(ModelViewSet):
    """
    ViewSet for managing notification templates (admin only).
    """
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    permission_classes = [permissions.IsAdminUser]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_notification(request):
    """
    Send a notification/email to a user.
    """
    try:
        notification_type = request.data.get('type')
        recipient_email = request.data.get('recipient_email')
        recipient_name = request.data.get('recipient_name')
        data = request.data.get('data', {})
        
        if not notification_type or not recipient_email:
            return Response(
                {'error': 'Type and recipient_email are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try to find user by email
        try:
            from apps.users.models import User
            user = User.objects.get(email=recipient_email)
        except User.DoesNotExist:
            # Create a notification for non-registered users
            user = None
        
        # Create notification record
        if user:
            notification = Notification.objects.create(
                user=user,
                title=f"Email: {notification_type.replace('_', ' ').title()}",
                message=f"Email sent to {recipient_email}",
                notification_type='email',
                is_read=False,
                metadata={
                    'email_type': notification_type,
                    'recipient_email': recipient_email,
                    'recipient_name': recipient_name,
                    'email_data': data
                }
            )
        else:
            # For non-registered users, we'll just log the email
            notification = None
        
        # TODO: Implement actual email sending with your email service
        # For now, we'll just log the email that would be sent
        print(f"📧 Email Notification:")
        print(f"   Type: {notification_type}")
        print(f"   To: {recipient_name} <{recipient_email}>")
        print(f"   Data: {data}")
        
        # In production, you would integrate with:
        # - SendGrid
        # - AWS SES
        # - Mailgun
        # - Or any other email service
        
        response_data = {
            'message': 'Email notification queued successfully',
            'email_type': notification_type,
            'recipient': recipient_email
        }
        
        if notification:
            response_data['notification_id'] = notification.id
        
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to send notification: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def notification_preferences(request):
    """
    Get current user's notification preferences.
    """
    preferences, created = NotificationPreference.objects.get_or_create(
        user=request.user
    )
    serializer = NotificationPreferenceSerializer(preferences)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_notification_preferences(request):
    """
    Update current user's notification preferences.
    """
    preferences, created = NotificationPreference.objects.get_or_create(
        user=request.user
    )
    serializer = NotificationPreferenceSerializer(
        preferences,
        data=request.data,
        partial=True
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
