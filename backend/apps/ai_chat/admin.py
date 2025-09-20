"""
Django admin configuration for AI Chat models.
"""
from django.contrib import admin
from .models import ChatSession, ChatMessage, AIKnowledgeBase, ChatFeedback


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'is_active', 'created_at', 'message_count']
    list_filter = ['is_active', 'created_at', 'user__user_role']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'title']
    readonly_fields = ['created_at', 'updated_at']
    
    def message_count(self, obj):
        return obj.messages.count()
    message_count.short_description = 'Messages'


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'session', 'message_type', 'content_preview', 'created_at', 'response_time_ms']
    list_filter = ['message_type', 'created_at', 'session__user__user_role']
    search_fields = ['content', 'session__user__email']
    readonly_fields = ['created_at']
    raw_id_fields = ['session']
    
    def content_preview(self, obj):
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'


@admin.register(AIKnowledgeBase)
class AIKnowledgeBaseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'priority', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'priority', 'created_at']
    search_fields = ['title', 'content', 'keywords']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (None, {
            'fields': ('title', 'category', 'priority', 'is_active')
        }),
        ('Content', {
            'fields': ('content', 'keywords')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ChatFeedback)
class ChatFeedbackAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'message', 'rating', 'created_at']
    list_filter = ['rating', 'created_at', 'user__user_role']
    search_fields = ['user__email', 'comment', 'message__content']
    readonly_fields = ['created_at']
    raw_id_fields = ['message', 'user']