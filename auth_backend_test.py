#!/usr/bin/env python3
"""
Authentication-focused Backend API Tests for Galactic Quest
Testing the specific issues mentioned in the review request:
1. User registration and login flow
2. JWT token handling and storage
3. Session persistence
"""

import requests
import json
import time
from datetime import datetime

# Use the public endpoint from frontend .env
BACKEND_URL = "http://localhost:8001"
API_BASE_URL = f"{BACKEND_URL}/api"

class AuthTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.user_data = None
        self.test_results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details: dict = None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data: dict = None, headers: dict = None):
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{API_BASE_URL}{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        
        if self.auth_token:
            request_headers['Authorization'] = f"Bearer {self.auth_token}"
        
        if headers:
            request_headers.update(headers)
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=request_headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=request_headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=request_headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=request_headers)
            
            try:
                response_data = response.json()
            except:
                response_data = {'raw_response': response.text}
            
            return response.status_code < 400, response_data, response.status_code
        except Exception as e:
            return False, {'error': str(e)}, 0
    
    def test_health_check(self):
        """Test API health check"""
        success, response, status_code = self.make_request('GET', '/health')
        
        if success and response.get('status') == 'healthy':
            self.log_result(
                "Health Check", 
                True, 
                "API is healthy and responding",
                {'status_code': status_code, 'timestamp': response.get('timestamp')}
            )
            return True
        else:
            self.log_result(
                "Health Check", 
                False, 
                f"Health check failed: {response}",
                {'status_code': status_code}
            )
            return False
    
    def test_user_registration(self):
        """Test user registration with the test user from review request"""
        test_user = {
            "username": "authtest_user",
            "email": "authtest@example.com", 
            "password": "testpass123",
            "avatar": "🧪"
        }
        
        success, response, status_code = self.make_request('POST', '/auth/register', test_user)
        
        if success and 'access_token' in response:
            self.auth_token = response['access_token']
            self.user_data = response
            self.log_result(
                "User Registration", 
                True, 
                f"Successfully registered user: {response['username']}",
                {
                    'user_id': response['id'], 
                    'rank': response['current_rank'],
                    'status_code': status_code,
                    'token_length': len(response['access_token'])
                }
            )
            return True
        else:
            self.log_result(
                "User Registration", 
                False, 
                f"Registration failed: {response.get('detail', 'Unknown error')}",
                {'status_code': status_code, 'response': response}
            )
            return False
    
    def test_user_login(self):
        """Test user login with test credentials"""
        login_data = {
            "email": "authtest@example.com",
            "password": "testpass123"
        }
        
        success, response, status_code = self.make_request('POST', '/auth/login', login_data)
        
        if success and 'access_token' in response:
            # Update token for subsequent tests
            old_token = self.auth_token
            self.auth_token = response['access_token']
            self.log_result(
                "User Login", 
                True, 
                f"Successfully logged in user: {response['username']}",
                {
                    'status_code': status_code,
                    'token_type': response.get('token_type'),
                    'token_changed': old_token != self.auth_token,
                    'token_length': len(response['access_token'])
                }
            )
            return True
        else:
            self.log_result(
                "User Login", 
                False, 
                f"Login failed: {response.get('detail', 'Unknown error')}",
                {'status_code': status_code, 'response': response}
            )
            return False
    
    def test_token_validation(self):
        """Test JWT token validation"""
        success, response, status_code = self.make_request('GET', '/auth/me')
        
        if success and 'username' in response:
            self.log_result(
                "Token Validation", 
                True, 
                f"Token validated successfully for user: {response['username']}",
                {
                    'user_id': response['id'], 
                    'total_xp': response['total_xp'],
                    'status_code': status_code,
                    'last_active': response.get('last_active')
                }
            )
            return True
        else:
            self.log_result(
                "Token Validation", 
                False, 
                f"Token validation failed: {response.get('detail', 'Unknown error')}",
                {'status_code': status_code, 'response': response}
            )
            return False
    
    def test_token_persistence(self):
        """Test token persistence across multiple requests"""
        # Make multiple requests to test session persistence
        endpoints_to_test = ['/auth/me', '/categories', '/skills']
        all_success = True
        
        for endpoint in endpoints_to_test:
            success, response, status_code = self.make_request('GET', endpoint)
            if not success:
                all_success = False
                self.log_result(
                    f"Token Persistence ({endpoint})", 
                    False, 
                    f"Failed to access {endpoint}: {response.get('detail', 'Unknown error')}",
                    {'status_code': status_code}
                )
            else:
                self.log_result(
                    f"Token Persistence ({endpoint})", 
                    True, 
                    f"Successfully accessed {endpoint}",
                    {'status_code': status_code}
                )
        
        return all_success
    
    def test_invalid_token(self):
        """Test behavior with invalid token"""
        # Save current token
        valid_token = self.auth_token
        
        # Set invalid token
        self.auth_token = "invalid_token_12345"
        
        success, response, status_code = self.make_request('GET', '/auth/me')
        
        # Restore valid token
        self.auth_token = valid_token
        
        if not success and status_code == 401:
            self.log_result(
                "Invalid Token Handling", 
                True, 
                "Correctly rejected invalid token",
                {'status_code': status_code, 'error_message': response.get('detail')}
            )
            return True
        else:
            self.log_result(
                "Invalid Token Handling", 
                False, 
                "Failed to reject invalid token",
                {'status_code': status_code, 'response': response}
            )
            return False
    
    def test_categories_api(self):
        """Test categories API for Add Skill Modal"""
        success, response, status_code = self.make_request('GET', '/categories')
        
        if success and isinstance(response, list):
            self.log_result(
                "Categories API", 
                True, 
                f"Successfully retrieved {len(response)} categories",
                {
                    'status_code': status_code,
                    'category_count': len(response),
                    'sample_categories': [cat.get('name', 'Unknown') for cat in response[:3]]
                }
            )
            return True
        else:
            self.log_result(
                "Categories API", 
                False, 
                f"Failed to retrieve categories: {response.get('detail', 'Unknown error')}",
                {'status_code': status_code, 'response': response}
            )
            return False
    
    def test_predefined_categories_api(self):
        """Test predefined categories API for Add Skill Modal"""
        success, response, status_code = self.make_request('GET', '/categories/predefined')
        
        if success and isinstance(response, list):
            self.log_result(
                "Predefined Categories API", 
                True, 
                f"Successfully retrieved {len(response)} predefined categories",
                {
                    'status_code': status_code,
                    'category_count': len(response),
                    'sample_categories': [cat.get('name', 'Unknown') for cat in response[:3]]
                }
            )
            return True
        else:
            self.log_result(
                "Predefined Categories API", 
                False, 
                f"Failed to retrieve predefined categories: {response.get('detail', 'Unknown error')}",
                {'status_code': status_code, 'response': response}
            )
            return False
    
    def test_settings_api(self):
        """Test settings API for Add Skill Modal"""
        success, response, status_code = self.make_request('GET', '/settings')
        
        if success and 'use_predefined_categories' in response:
            self.log_result(
                "Settings API", 
                True, 
                f"Successfully retrieved user settings",
                {
                    'status_code': status_code,
                    'use_predefined_categories': response.get('use_predefined_categories'),
                    'notifications': response.get('notifications'),
                    'theme': response.get('theme')
                }
            )
            return True
        else:
            self.log_result(
                "Settings API", 
                False, 
                f"Failed to retrieve settings: {response.get('detail', 'Unknown error')}",
                {'status_code': status_code, 'response': response}
            )
            return False
    
    def run_all_tests(self):
        """Run all authentication tests"""
        print(f"\n🔐 Starting Authentication-focused Backend API Tests")
        print(f"📡 Testing API at: {API_BASE_URL}")
        print("=" * 80)
        
        # Test sequence focusing on authentication issues
        test_sequence = [
            ("API Health", [
                self.test_health_check,
            ]),
            ("Authentication Flow", [
                self.test_user_registration,
                self.test_user_login,
                self.test_token_validation,
                self.test_token_persistence,
                self.test_invalid_token,
            ]),
            ("Add Skill Modal APIs", [
                self.test_categories_api,
                self.test_predefined_categories_api,
                self.test_settings_api,
            ])
        ]
        
        total_tests = 0
        passed_tests = 0
        
        for section_name, tests in test_sequence:
            print(f"\n📋 {section_name}")
            print("-" * 50)
            
            for test_func in tests:
                total_tests += 1
                try:
                    result = test_func()
                    if result:
                        passed_tests += 1
                except Exception as e:
                    self.log_result(
                        test_func.__name__, 
                        False, 
                        f"Test crashed: {str(e)}", 
                        {'exception': type(e).__name__}
                    )
        
        # Summary
        print("\n" + "=" * 80)
        print(f"🏁 AUTHENTICATION TEST SUMMARY")
        print(f"📊 Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {total_tests - passed_tests}")
        print(f"📈 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if passed_tests == total_tests:
            print("🎉 ALL AUTHENTICATION TESTS PASSED! Backend auth is working correctly.")
        else:
            print("⚠️  Some authentication tests failed. Check the details above.")
        
        return passed_tests, total_tests

def main():
    """Main test runner"""
    tester = AuthTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()