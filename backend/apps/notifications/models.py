"""
Notification models for KindBite application.
Comprehensive notification system with templates and preferences.
"""
from django.db import models
from django.contrib.auth import get_user_model
from apps.common.models import BaseModel

User = get_user_model()


class NotificationTemplate(BaseModel):
    """
    Template for different types of notifications.
    """
    class NotificationType(models.TextChoices):
        FOOD_RESERVED = 'food_reserved', 'Food Reserved'
        FOOD_CANCELLED = 'food_cancelled', 'Food Cancelled'
        PAYMENT_SUCCESS = 'payment_success', 'Payment Successful'
        PAYMENT_FAILED = 'payment_failed', 'Payment Failed'
        KINDCOINS_EARNED = 'kindcoins_earned', 'KindCoins Earned'
        NEW_FOOD_AVAILABLE = 'new_food_available', 'New Food Available'
        PICKUP_REMINDER = 'pickup_reminder', 'Pickup Reminder'
        SYSTEM_ANNOUNCEMENT = 'system_announcement', 'System Announcement'
        FOOD_RATED = 'food_rated', 'Food Rated'
        RESERVATION_CONFIRMED = 'reservation_confirmed', 'Reservation Confirmed'
        RESERVATION_CANCELLED = 'reservation_cancelled', 'Reservation Cancelled'

    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'

    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
        unique=True
    )
    title_template = models.CharField(max_length=200)
    message_template = models.TextField()
    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    is_active = models.BooleanField(default=True)
    variables_help = models.TextField(
        blank=True,
        help_text='Available variables for this template'
    )

    class Meta:
        db_table = 'notification_templates'
        verbose_name = 'Notification Template'
        verbose_name_plural = 'Notification Templates'

    def __str__(self):
        return f"{self.get_notification_type_display()} Template"


class NotificationPreference(BaseModel):
    """
    User notification preferences.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )
    
    # Email preferences
    email_enabled = models.BooleanField(default=True)
    email_food_updates = models.BooleanField(default=True)
    email_payment_updates = models.BooleanField(default=True)
    email_system_announcements = models.BooleanField(default=True)
    
    # Push notification preferences
    push_enabled = models.BooleanField(default=True)
    push_food_updates = models.BooleanField(default=True)
    push_payment_updates = models.BooleanField(default=True)
    push_system_announcements = models.BooleanField(default=True)
    
    # In-app notification preferences
    in_app_enabled = models.BooleanField(default=True)
    in_app_food_updates = models.BooleanField(default=True)
    in_app_payment_updates = models.BooleanField(default=True)
    in_app_system_announcements = models.BooleanField(default=True)
    
    # Quiet hours
    quiet_hours_enabled = models.BooleanField(default=False)
    quiet_hours_start = models.TimeField(blank=True, null=True)
    quiet_hours_end = models.TimeField(blank=True, null=True)

    class Meta:
        db_table = 'notification_preferences'
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'

    def __str__(self):
        return f"Preferences for {self.user.get_full_name()}"


class NotificationChannel(BaseModel):
    """
    Notification delivery channels (websocket, push, etc.).
    """
    channel_name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    last_seen = models.DateTimeField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        db_table = 'notification_channels'
        verbose_name = 'Notification Channel'
        verbose_name_plural = 'Notification Channels'

    def __str__(self):
        return self.channel_name


class Notification(BaseModel):
    """
    Individual notifications sent to users.
    """
    class NotificationType(models.TextChoices):
        FOOD_RESERVED = 'food_reserved', 'Food Reserved'
        FOOD_CANCELLED = 'food_cancelled', 'Food Cancelled'
        PAYMENT_SUCCESS = 'payment_success', 'Payment Successful'
        PAYMENT_FAILED = 'payment_failed', 'Payment Failed'
        KINDCOINS_EARNED = 'kindcoins_earned', 'KindCoins Earned'
        NEW_FOOD_AVAILABLE = 'new_food_available', 'New Food Available'
        PICKUP_REMINDER = 'pickup_reminder', 'Pickup Reminder'
        SYSTEM_ANNOUNCEMENT = 'system_announcement', 'System Announcement'
        FOOD_RATED = 'food_rated', 'Food Rated'
        RESERVATION_CONFIRMED = 'reservation_confirmed', 'Reservation Confirmed'
        RESERVATION_CANCELLED = 'reservation_cancelled', 'Reservation Cancelled'

    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(
        max_length=30,
        choices=NotificationType.choices
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(blank=True, null=True)
    data = models.JSONField(blank=True, default=dict)
    action_url = models.URLField(
        blank=True,
        help_text='URL to navigate to when notification is clicked'
    )
    
    # Optional related objects
    food_listing = models.ForeignKey(
        'foods.FoodListing',
        on_delete=models.CASCADE,
        related_name='notifications',
        blank=True,
        null=True
    )
    food_reservation = models.ForeignKey(
        'foods.FoodReservation',
        on_delete=models.CASCADE,
        related_name='notifications',
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.get_full_name()}"

    def mark_as_read(self):
        """Mark notification as read."""
        self.is_read = True
        self.save(update_fields=['is_read'])

    def mark_as_sent(self):
        """Mark notification as sent."""
        self.is_sent = True
        self.save(update_fields=['is_sent'])
