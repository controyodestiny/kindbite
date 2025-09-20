"""
AI Chat models for KindBite application.
Handles chat conversations and message history.
"""
from django.db import models
from apps.common.models import BaseModel
from apps.users.models import User


class ChatSession(BaseModel):
    """
    Represents a chat session between a user and the AI.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    title = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'chat_sessions'
        verbose_name = 'Chat Session'
        verbose_name_plural = 'Chat Sessions'
        ordering = ['-created_at']

    def __str__(self):
        return f"Chat Session {self.id} - {self.user.get_full_name()}"

    def save(self, *args, **kwargs):
        if not self.title:
            # Auto-generate title from first message or use default
            self.title = f"Chat {self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else 'New'}"
        super().save(*args, **kwargs)


class ChatMessage(BaseModel):
    """
    Individual messages within a chat session.
    """
    class MessageType(models.TextChoices):
        USER = 'user', 'User Message'
        AI = 'ai', 'AI Response'
        SYSTEM = 'system', 'System Message'

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    message_type = models.CharField(max_length=10, choices=MessageType.choices)
    content = models.TextField()
    
    # Additional metadata
    response_time_ms = models.PositiveIntegerField(null=True, blank=True)  # AI response time
    tokens_used = models.PositiveIntegerField(null=True, blank=True)  # For API usage tracking
    
    class Meta:
        db_table = 'chat_messages'
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.message_type.title()} message in {self.session}"


class AIKnowledgeBase(BaseModel):
    """
    Knowledge base entries for AI responses about KindBite and food topics.
    """
    class Category(models.TextChoices):
        KINDBITE_INFO = 'kindbite', 'KindBite Information'
        FOOD_SAFETY = 'food_safety', 'Food Safety'
        NUTRITION = 'nutrition', 'Nutrition'
        SUSTAINABILITY = 'sustainability', 'Sustainability'
        RECIPES = 'recipes', 'Recipes'
        FOOD_WASTE = 'food_waste', 'Food Waste'
        GENERAL = 'general', 'General'

    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=Category.choices)
    content = models.TextField()
    keywords = models.JSONField(default=list, help_text="Keywords for search matching")
    is_active = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(default=1, help_text="Higher priority entries are preferred")
    
    class Meta:
        db_table = 'ai_knowledge_base'
        verbose_name = 'AI Knowledge Entry'
        verbose_name_plural = 'AI Knowledge Base'
        ordering = ['-priority', 'title']

    def __str__(self):
        return f"{self.title} ({self.category})"


class ChatFeedback(BaseModel):
    """
    User feedback on AI responses for improving the system.
    """
    class Rating(models.IntegerChoices):
        VERY_BAD = 1, 'Very Bad'
        BAD = 2, 'Bad'
        NEUTRAL = 3, 'Neutral'
        GOOD = 4, 'Good'
        EXCELLENT = 5, 'Excellent'

    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, related_name='feedback')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=Rating.choices)
    comment = models.TextField(blank=True)
    
    class Meta:
        db_table = 'chat_feedback'
        verbose_name = 'Chat Feedback'
        verbose_name_plural = 'Chat Feedback'
        unique_together = ['message', 'user']  # One feedback per user per message

    def __str__(self):
        return f"Feedback {self.rating}/5 for message {self.message.id}"