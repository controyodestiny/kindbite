"""
AI Chat URL patterns for KindBite application.
"""
from django.urls import path
from . import views

urlpatterns = [
    # Chat session endpoints
    path('sessions/', views.ChatSessionListView.as_view(), name='chat-session-list'),
    path('sessions/new/', views.create_new_chat, name='create-chat-session'),
    path('sessions/<int:pk>/', views.ChatSessionDetailView.as_view(), name='chat-session-detail'),
    
    # Message endpoints
    path('send/', views.SendMessageView.as_view(), name='send-message'),
    path('messages/<int:pk>/feedback/', views.ChatFeedbackView.as_view(), name='chat-feedback'),
    
    # Stats and utility endpoints
    path('stats/', views.chat_stats, name='chat-stats'),
]