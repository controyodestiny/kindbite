"""
Notification serializers for KindBite application.
Clean, secure serialization for notification data.
"""
from rest_framework import serializers
from .models import Notification, NotificationPreference, NotificationTemplate


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for notifications.
    """
    notification_type_display = serializers.CharField(
        source='get_notification_type_display',
        read_only=True
    )
    priority_display = serializers.CharField(
        source='get_priority_display',
        read_only=True
    )
    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True
    )
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'user_name', 'notification_type', 'notification_type_display',
            'title', 'message', 'priority', 'priority_display', 'is_read', 'is_sent',
            'sent_at', 'data', 'action_url', 'food_listing', 'food_reservation',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'is_sent', 'sent_at', 'created_at', 'updated_at'
        ]


class NotificationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating notifications.
    """
    class Meta:
        model = Notification
        fields = [
            'notification_type', 'title', 'message', 'priority',
            'data', 'action_url', 'food_listing', 'food_reservation'
        ]


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """
    Serializer for notification preferences.
    """
    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True
    )
    
    class Meta:
        model = NotificationPreference
        fields = [
            'id', 'user', 'user_name',
            'email_enabled', 'email_food_updates', 'email_payment_updates', 'email_system_announcements',
            'push_enabled', 'push_food_updates', 'push_payment_updates', 'push_system_announcements',
            'in_app_enabled', 'in_app_food_updates', 'in_app_payment_updates', 'in_app_system_announcements',
            'quiet_hours_enabled', 'quiet_hours_start', 'quiet_hours_end',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class NotificationTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for notification templates.
    """
    notification_type_display = serializers.CharField(
        source='get_notification_type_display',
        read_only=True
    )
    priority_display = serializers.CharField(
        source='get_priority_display',
        read_only=True
    )
    
    class Meta:
        model = NotificationTemplate
        fields = [
            'id', 'notification_type', 'notification_type_display',
            'title_template', 'message_template', 'priority', 'priority_display',
            'is_active', 'variables_help', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationStatsSerializer(serializers.Serializer):
    """
    Serializer for notification statistics.
    """
    total_notifications = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
    notifications_by_type = serializers.DictField()
    notifications_by_priority = serializers.DictField()
    recent_notifications = NotificationSerializer(many=True)
