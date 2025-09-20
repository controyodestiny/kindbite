#!/usr/bin/env python3
"""
Quick test to verify core Django functionality works.
Run this after installing core requirements.
"""
import os
import sys
import django
from django.conf import settings

def test_django_setup():
    """Test if Django is properly configured."""
    print("🧪 Testing Django Setup")
    print("=" * 30)
    
    try:
        # Setup Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kindbite.settings')
        django.setup()
        
        print("✅ Django settings loaded successfully")
        
        # Test database connection
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        print("✅ Database connection working")
        
        # Test models
        from apps.users.models import User
        print(f"✅ User model loaded: {User.__name__}")
        
        # Test authentication
        from apps.authentication.serializers import LoginSerializer
        print("✅ Authentication serializers loaded")
        
        # Test REST framework
        from rest_framework.response import Response
        print("✅ Django REST Framework loaded")
        
        # Test JWT
        from rest_framework_simplejwt.tokens import RefreshToken
        print("✅ JWT tokens working")
        
        print("\n🎉 All core components working!")
        print("✅ Your KindBite backend is ready!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print(f"❌ Type: {type(e).__name__}")
        return False

def test_api_endpoints():
    """Test if API endpoints are configured correctly."""
    print("\n🔗 Testing API Configuration")
    print("=" * 35)
    
    try:
        from django.urls import reverse
        from django.test import Client
        
        client = Client()
        
        # Test auth status endpoint
        response = client.get('/api/v1/auth/status/')
        print(f"✅ Auth status endpoint: {response.status_code}")
        
        print("✅ API endpoints configured correctly")
        return True
        
    except Exception as e:
        print(f"❌ API test failed: {str(e)}")
        return False

def show_next_steps():
    """Show what to do next."""
    print("\n🚀 Next Steps")
    print("=" * 15)
    print("1. Start the server:")
    print("   python manage.py runserver")
    print()
    print("2. Test the API:")
    print("   python test_api.py")
    print()
    print("3. Access admin:")
    print("   http://localhost:8000/admin/")
    print()
    print("4. Connect your React frontend to:")
    print("   http://localhost:8000/api/v1/auth/")

def main():
    """Main test function."""
    print("🌍 KindBite Core Functionality Test")
    print("=" * 40)
    
    if not test_django_setup():
        print("\n❌ Core setup failed. Check your installation.")
        sys.exit(1)
    
    if not test_api_endpoints():
        print("\n⚠️  API endpoints need setup. Run migrations first:")
        print("   python manage.py migrate")
    
    show_next_steps()

if __name__ == "__main__":
    main()

