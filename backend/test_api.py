#!/usr/bin/env python3
"""
KindBite API Test Script
Quick test to verify API endpoints are working.
"""
import requests
import json
import sys


class KindBiteAPITester:
    def __init__(self, base_url='http://localhost:8002/api/v1'):
        self.base_url = base_url
        self.session = requests.Session()
        self.access_token = None
    
    def test_endpoint(self, method, endpoint, data=None, auth_required=False):
        """Test an API endpoint."""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth_required and self.access_token:
            headers['Authorization'] = f'Bearer {self.access_token}'
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers)
            elif method.upper() == 'POST':
                response = self.session.post(url, headers=headers, json=data)
            else:
                print(f"❌ Unsupported method: {method}")
                return False
            
            if response.status_code in [200, 201]:
                print(f"✅ {method} {endpoint} - Status: {response.status_code}")
                return response.json()
            else:
                print(f"❌ {method} {endpoint} - Status: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except requests.exceptions.ConnectionError:
            print(f"❌ Connection failed to {url}")
            print("   Make sure the Django server is running: python manage.py runserver")
            return False
        except Exception as e:
            print(f"❌ {method} {endpoint} - Error: {str(e)}")
            return False
    
    def test_auth_flow(self):
        """Test the complete authentication flow."""
        print("\n🔐 Testing Authentication Flow")
        print("=" * 40)
        
        # Test registration
        register_data = {
            "email": "test@kindbite.test",
            "password": "testpass123",
            "confirm_password": "testpass123",
            "first_name": "Test",
            "last_name": "User",
            "user_role": "end-user",
            "phone": "+256700999999",
            "location": "Test City"
        }
        
        register_response = self.test_endpoint('POST', '/auth/register/', register_data)
        if register_response and 'tokens' in register_response:
            self.access_token = register_response['tokens']['access']
            print(f"   🎉 Registration successful! Welcome {register_response['user']['full_name']}")
        
        # Test login with demo user
        login_data = {
            "email": "user@kindbite.demo",
            "password": "demo123"
        }
        
        login_response = self.test_endpoint('POST', '/auth/login/', login_data)
        if login_response and 'access' in login_response:
            self.access_token = login_response['access']
            print(f"   🎉 Login successful! Welcome {login_response['user']['full_name']}")
        
        # Test getting current user
        if self.access_token:
            self.test_endpoint('GET', '/auth/me/', auth_required=True)
        
        return bool(self.access_token)
    
    def test_users_endpoints(self):
        """Test user-related endpoints."""
        print("\n👥 Testing Users Endpoints")
        print("=" * 40)
        
        # Test getting users list
        self.test_endpoint('GET', '/users/', auth_required=True)
        
        # Test getting providers
        self.test_endpoint('GET', '/users/providers/', auth_required=True)
        
        # Test getting current user profile
        self.test_endpoint('GET', '/users/me/', auth_required=True)
    
    def run_all_tests(self):
        """Run all API tests."""
        print("🧪 KindBite API Test Suite")
        print("=" * 50)
        
        # Test basic connectivity
        print("\n🌐 Testing API Connectivity")
        print("=" * 30)
        auth_status = self.test_endpoint('GET', '/auth/status/')
        if not auth_status:
            print("❌ Cannot connect to API. Make sure the server is running.")
            sys.exit(1)
        
        # Test authentication
        if not self.test_auth_flow():
            print("❌ Authentication tests failed.")
            return False
        
        # Test user endpoints
        self.test_users_endpoints()
        
        print("\n🎉 API Tests Completed!")
        print("=" * 30)
        print("✅ Your KindBite backend is working correctly!")
        print("🔗 You can now connect your React frontend.")
        
        return True


def main():
    """Main test function."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Test KindBite API endpoints')
    parser.add_argument('--url', default='http://localhost:8002/api/v1', 
                       help='Base URL for the API (default: http://localhost:8002/api/v1)')
    
    args = parser.parse_args()
    
    tester = KindBiteAPITester(args.url)
    success = tester.run_all_tests()
    
    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()

