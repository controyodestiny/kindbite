"""
Serializers for AI Chat API endpoints.
"""
from rest_framework import serializers
from .models import ChatSession, ChatMessage, ChatFeedback, AIKnowledgeBase


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages."""
    
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'message_type', 'content', 'created_at', 
            'response_time_ms', 'tokens_used'
        ]
        read_only_fields = ['id', 'created_at', 'response_time_ms', 'tokens_used']


class ChatSessionSerializer(serializers.ModelSerializer):
    """Serializer for chat sessions."""
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    last_message_at = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = [
            'id', 'title', 'is_active', 'created_at', 'updated_at',
            'messages', 'message_count', 'last_message_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_message_count(self, obj):
        return obj.messages.count()

    def get_last_message_at(self, obj):
        last_message = obj.messages.last()
        return last_message.created_at if last_message else None


class ChatSessionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing chat sessions."""
    message_count = serializers.SerializerMethodField()
    last_message_at = serializers.SerializerMethodField()
    last_message_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatSession
        fields = [
            'id', 'title', 'is_active', 'created_at', 'updated_at',
            'message_count', 'last_message_at', 'last_message_preview'
        ]

    def get_message_count(self, obj):
        return obj.messages.count()

    def get_last_message_at(self, obj):
        last_message = obj.messages.last()
        return last_message.created_at if last_message else None

    def get_last_message_preview(self, obj):
        last_message = obj.messages.last()
        if last_message:
            preview = last_message.content[:100]
            return preview + "..." if len(last_message.content) > 100 else preview
        return None


class SendMessageSerializer(serializers.Serializer):
    """Serializer for sending a message to AI chat."""
    message = serializers.CharField(max_length=2000)
    session_id = serializers.IntegerField(required=False, allow_null=True)
    
    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError("Message cannot be empty.")
        return value.strip()


class ChatResponseSerializer(serializers.Serializer):
    """Serializer for AI chat response."""
    session_id = serializers.IntegerField()
    user_message = ChatMessageSerializer()
    ai_response = ChatMessageSerializer()
    session_title = serializers.CharField()


class ChatFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for chat feedback."""
    
    class Meta:
        model = ChatFeedback
        fields = ['id', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']


class AIKnowledgeBaseSerializer(serializers.ModelSerializer):
    """Serializer for AI knowledge base entries."""
    
    class Meta:
        model = AIKnowledgeBase
        fields = [
            'id', 'title', 'category', 'content', 'keywords', 
            'is_active', 'priority', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']





















