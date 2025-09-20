"""
URL configuration for AI Chat app.
"""
from django.urls import path
from . import views

app_name = 'ai_chat'

urlpatterns = [
    # Chat session management
    path('sessions/', views.ChatSessionListView.as_view(), name='session-list'),
    path('sessions/<int:session_id>/', views.ChatSessionDetailView.as_view(), name='session-detail'),
    path('sessions/new/', views.create_new_chat, name='create-session'),
    
    # Chat messaging
    path('send/', views.SendMessageView.as_view(), name='send-message'),
    
    # Feedback
    path('messages/<int:message_id>/feedback/', views.ChatFeedbackView.as_view(), name='message-feedback'),
    
    # Statistics
    path('stats/', views.chat_stats, name='chat-stats'),
]

