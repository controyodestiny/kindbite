"""
WSGI config for KindBite project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kindbite.settings')

application = get_wsgi_application()


