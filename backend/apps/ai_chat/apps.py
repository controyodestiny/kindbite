"""
Django app configuration for AI Chat.
"""
from django.apps import AppConfig


class AiChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.ai_chat'
    verbose_name = 'AI Chat'
    
    def ready(self):
        """
        Import signal handlers when the app is ready.
        """
        # Import signals here if needed
        pass