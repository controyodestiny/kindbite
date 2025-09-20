"""
Django app configuration for Foods.
"""
from django.apps import AppConfig


class FoodsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.foods'
    verbose_name = 'Food Management'
    
    def ready(self):
        """
        Import signal handlers when the app is ready.
        """
        # Import signals here if needed
        pass