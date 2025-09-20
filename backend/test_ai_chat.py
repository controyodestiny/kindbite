#!/usr/bin/env python
"""
Test script for AI Chat API endpoints.
Run this after setting up the backend to verify AI chat functionality.
"""
import os
import sys
import django
import requests
import json
from datetime import datetime

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kindbite.settings')
django.setup()

from apps.users.models import User
from apps.ai_chat.services import AIResponseService, ChatSessionService

# Test configuration
API_BASE_URL = 'http://localhost:8002/api/v1'
TEST_USER_EMAIL = 'testuser@example.com'
TEST_USER_PASSWORD = 'testpass123'

def print_test_header(test_name):
    print(f"\n{'='*50}")
    print(f"🧪 {test_name}")
    print(f"{'='*50}")

def print_success(message):
    print(f"✅ {message}")

def print_error(message):
    print(f"❌ {message}")

def print_info(message):
    print(f"ℹ️  {message}")

def test_ai_service_directly():
    """Test AI service directly (without API)"""
    print_test_header("Direct AI Service Test")
    
    try:
        # Create test user if doesn't exist
        user, created = User.objects.get_or_create(
            email=TEST_USER_EMAIL,
            defaults={
                'first_name': 'Test',
                'last_name': 'User',
                'phone': '+1234567890',
                'location': 'Test City',
                'user_role': 'end-user'
            }
        )
        if created:
            user.set_password(TEST_USER_PASSWORD)
            user.save()
            print_success("Created test user")
        else:
            print_info("Using existing test user")
        
        # Create chat session
        session = ChatSessionService.get_or_create_session(user)
        print_success(f"Created chat session: {session.id}")
        
        # Test AI responses
        ai_service = AIResponseService()
        test_messages = [
            "Hello!",
            "What is KindBite?",
            "How do I earn KindCoins?",
            "Tell me about food safety",
            "What are some recipes for leftover bread?"
        ]
        
        for message in test_messages:
            print_info(f"Testing message: '{message}'")
            try:
                response, response_time = ai_service.generate_response(message, session)
                
                # Create messages in database
                ChatSessionService.create_message(session, 'user', message)
                ChatSessionService.create_message(
                    session, 'ai', response, response_time
                )
                
                print_success(f"Response generated in {response_time}ms")
                print(f"Response preview: {response[:100]}...")
                
            except Exception as e:
                print_error(f"Failed to generate response: {e}")
        
        print_success("Direct AI service test completed")
        
    except Exception as e:
        print_error(f"Direct AI service test failed: {e}")

def get_auth_token():
    """Get authentication token for API tests"""
    try:
        response = requests.post(f"{API_BASE_URL}/auth/login/", {
            'email': TEST_USER_EMAIL,
            'password': TEST_USER_PASSWORD
        })
        
        if response.status_code == 200:
            data = response.json()
            return data.get('access')
        else:
            print_error(f"Login failed: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print_error(f"Failed to get auth token: {e}")
        return None

def test_chat_api():
    """Test AI Chat API endpoints"""
    print_test_header("AI Chat API Test")
    
    # Get auth token
    token = get_auth_token()
    if not token:
        print_error("Cannot test API without authentication token")
        return
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Test sending a message
        print_info("Testing send message endpoint...")
        response = requests.post(
            f"{API_BASE_URL}/chat/send/",
            headers=headers,
            json={'message': 'Hello, KindBite AI!'}
        )
        
        if response.status_code == 201:
            data = response.json()
            print_success("Message sent successfully")
            print_info(f"Session ID: {data.get('session_id')}")
            print_info(f"AI Response: {data.get('ai_response', {}).get('content', '')[:100]}...")
            
            session_id = data.get('session_id')
            
            # Test getting chat sessions
            print_info("Testing get sessions endpoint...")
            response = requests.get(f"{API_BASE_URL}/chat/sessions/", headers=headers)
            if response.status_code == 200:
                sessions = response.json()
                print_success(f"Retrieved {len(sessions)} chat sessions")
            else:
                print_error(f"Failed to get sessions: {response.status_code}")
            
            # Test getting session details
            if session_id:
                print_info(f"Testing get session detail for session {session_id}...")
                response = requests.get(
                    f"{API_BASE_URL}/chat/sessions/{session_id}/",
                    headers=headers
                )
                if response.status_code == 200:
                    session_data = response.json()
                    print_success(f"Session has {len(session_data.get('messages', []))} messages")
                else:
                    print_error(f"Failed to get session details: {response.status_code}")
            
        else:
            print_error(f"Failed to send message: {response.status_code} - {response.text}")
    
    except Exception as e:
        print_error(f"API test failed: {e}")

def test_openai_configuration():
    """Test OpenAI configuration"""
    print_test_header("OpenAI Configuration Test")
    
    from django.conf import settings
    
    if settings.OPENAI_API_KEY:
        print_success("OpenAI API key is configured")
        print_info(f"Key starts with: {settings.OPENAI_API_KEY[:10]}...")
        
        # Test basic OpenAI functionality
        try:
            import openai
            openai.api_key = settings.OPENAI_API_KEY
            print_success("OpenAI library imported successfully")
            print_info("Note: Actual API calls will be tested during chat interactions")
        except ImportError:
            print_error("OpenAI library not installed. Run: pip install openai")
        except Exception as e:
            print_error(f"OpenAI configuration error: {e}")
    else:
        print_error("OpenAI API key not configured")
        print_info("Add OPENAI_API_KEY to your .env file")

def main():
    """Run all tests"""
    print("🚀 KindBite AI Chat Testing Suite")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run tests
    test_openai_configuration()
    test_ai_service_directly()
    test_chat_api()
    
    print_test_header("Test Summary")
    print("✨ AI Chat testing completed!")
    print("\nNext steps:")
    print("1. Ensure your backend server is running: python manage.py runserver 8002")
    print("2. Test the chat interface in your frontend application")
    print("3. Check the Django admin for chat sessions and messages")

if __name__ == '__main__':
    main()

