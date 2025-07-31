#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Galactic Quest Skill Tracking App
Tests the critical fixes mentioned in the review request.
"""

import requests
import json
import sys
from datetime import datetime

# Use the public URL from frontend .env
BACKEND_URL = "http://localhost:8001"  # Will be updated from .env
API_BASE_URL = f"{BACKEND_URL}/api"

class GalacticQuestTester:
    def __init__(self):
        self.auth_token = None
        self.user_data = None
        self.test_results = []
        self.created_skills = []
        self.category_id = None
        
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
        """Make HTTP request and return (success, response_data)"""
        url = f"{API_BASE_URL}{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        
        if self.auth_token:
            request_headers['Authorization'] = f"Bearer {self.auth_token}"
        
        if headers:
            request_headers.update(headers)
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=request_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=request_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=request_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=request_headers, timeout=10)
            else:
                return False, {'error': f'Unsupported method: {method}'}
            
            try:
                response_data = response.json()
            except:
                response_data = {'status_code': response.status_code, 'text': response.text}
            
            return response.status_code < 400, response_data
        except Exception as e:
            return False, {'error': str(e)}
    
    def test_health_check(self):
        """Test API health check"""
        success, response = self.make_request('GET', '/health')
        
        if success and response.get('status') == 'healthy':
            self.log_result(
                "Health Check", 
                True, 
                "API is healthy and responding",
                {'timestamp': response.get('timestamp')}
            )
            return True
        else:
            self.log_result(
                "Health Check", 
                False, 
                f"Health check failed: {response}",
                response
            )
            return False
    
    def test_user_registration(self):
        """Test user registration - Phase 1 requirement"""
        test_user = {
            "username": "testuser3",
            "email": "testuser3@test.com", 
            "password": "test123",
            "avatar": "🚀"
        }
        
        success, response = self.make_request('POST', '/auth/register', test_user)
        
        if success and 'access_token' in response:
            self.auth_token = response['access_token']
            self.user_data = response
            self.log_result(
                "User Registration (testuser3)", 
                True, 
                f"Successfully registered user: {response['username']}",
                {'user_id': response['id'], 'rank': response['current_rank']}
            )
            return True
        else:
            self.log_result(
                "User Registration (testuser3)", 
                False, 
                f"Registration failed: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    def test_predefined_categories(self):
        """Test predefined categories are available - Phase 2 requirement"""
        success, response = self.make_request('GET', '/categories/predefined')
        
        if success and isinstance(response, list) and len(response) > 0:
            # Look for expected categories like MIND, BODY, CREATIVITY
            category_names = [cat.get('name', '') for cat in response]
            expected_categories = ['MIND', 'BODY', 'CREATIVITY']
            found_categories = [cat for cat in expected_categories if cat in category_names]
            
            self.log_result(
                "Predefined Categories", 
                True, 
                f"Found {len(response)} predefined categories including: {', '.join(found_categories)}",
                {'total_categories': len(response), 'categories': category_names[:5]}
            )
            return True
        else:
            self.log_result(
                "Predefined Categories", 
                False, 
                f"Failed to get predefined categories: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    def test_user_categories(self):
        """Test getting user categories (predefined + custom)"""
        success, response = self.make_request('GET', '/categories')
        
        if success and isinstance(response, list):
            self.categories = response
            # Store first category for skill creation
            if response:
                self.category_id = response[0]['id']
            
            self.log_result(
                "User Categories", 
                True, 
                f"Retrieved {len(response)} user categories",
                {'categories': [{'name': cat['name'], 'id': cat['id']} for cat in response[:3]]}
            )
            return True
        else:
            self.log_result(
                "User Categories", 
                False, 
                f"Failed to get user categories: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    def test_skill_creation_predefined_category(self):
        """Test creating skill in predefined category - Phase 2 requirement"""
        if not self.category_id:
            self.log_result("Skill Creation (Predefined)", False, "No category available", {})
            return False
        
        skill_data = {
            "name": "Python Programming",
            "category_id": self.category_id,
            "difficulty": "medium",
            "icon": "🐍",
            "description": "Learning Python programming language"
        }
        
        success, response = self.make_request('POST', '/skills', skill_data)
        
        if success and 'id' in response:
            self.created_skills.append(response)
            self.log_result(
                "Skill Creation (Predefined Category)", 
                True, 
                f"Created skill '{response['name']}' in predefined category",
                {'skill_id': response['id'], 'category_id': response['category_id']}
            )
            return True
        else:
            self.log_result(
                "Skill Creation (Predefined Category)", 
                False, 
                f"Failed to create skill: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    def test_time_logging_with_live_updates(self):
        """Test time logging with live updates - Phase 3 requirement"""
        if not self.created_skills:
            self.log_result("Time Logging", False, "No skills available for time logging", {})
            return False
        
        # Test custom time input (2 hours 30 minutes = 150 minutes)
        time_log_data = {
            "skill_id": self.created_skills[0]['id'],
            "minutes": 150,  # 2 hours 30 minutes
            "note": "Testing custom time input"
        }
        
        success, response = self.make_request('POST', '/time-logs', time_log_data)
        
        if success and 'xp_earned' in response:
            # Check if user_data is included for live updates
            has_live_update_data = 'user_data' in response
            
            self.log_result(
                "Time Logging with Live Updates", 
                True, 
                f"Logged 150 minutes (2h 30m), earned {response['xp_earned']} XP. Live updates: {'Yes' if has_live_update_data else 'No'}",
                {
                    'skill_id': response['skill_id'], 
                    'xp_earned': response['xp_earned'],
                    'live_updates': has_live_update_data,
                    'user_data': response.get('user_data', {})
                }
            )
            return True
        else:
            self.log_result(
                "Time Logging with Live Updates", 
                False, 
                f"Failed to log time: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    def test_quest_system(self):
        """Test quest system - Phase 4 requirement"""
        success, response = self.make_request('GET', '/quests')
        
        if success and isinstance(response, dict):
            daily_quests = response.get('daily_quests', [])
            weekly_quests = response.get('weekly_quests', [])
            
            self.log_result(
                "Quest System", 
                True, 
                f"Retrieved quests: {len(daily_quests)} daily, {len(weekly_quests)} weekly",
                {
                    'daily_count': len(daily_quests),
                    'weekly_count': len(weekly_quests),
                    'sample_quest': daily_quests[0] if daily_quests else None
                }
            )
            return True
        else:
            self.log_result(
                "Quest System", 
                False, 
                f"Failed to get quests: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    def test_user_settings(self):
        """Test user settings - Phase 5 requirement"""
        success, response = self.make_request('GET', '/settings')
        
        if success and 'use_predefined_categories' in response:
            self.log_result(
                "User Settings", 
                True, 
                f"Retrieved user settings. Predefined categories: {response['use_predefined_categories']}",
                {
                    'use_predefined_categories': response['use_predefined_categories'],
                    'notifications': response.get('notifications'),
                    'theme': response.get('theme')
                }
            )
            return True
        else:
            self.log_result(
                "User Settings", 
                False, 
                f"Failed to get settings: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    def test_reset_functionality(self):
        """Test reset all data functionality - Phase 5 requirement"""
        success, response = self.make_request('POST', '/auth/reset-user-data')
        
        if success and response.get('message'):
            self.log_result(
                "Reset Functionality", 
                True, 
                f"Reset successful: {response['message']}",
                {'message': response['message']}
            )
            return True
        else:
            self.log_result(
                "Reset Functionality", 
                False, 
                f"Reset failed: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    def run_all_tests(self):
        """Run all critical tests"""
        print(f"\n🚀 Starting Galactic Quest Backend API Tests")
        print(f"📡 Testing API at: {API_BASE_URL}")
        print("=" * 80)
        
        # Test sequence based on review requirements
        test_sequence = [
            ("Phase 1: Authentication & Basic Load", [
                self.test_health_check,
                self.test_user_registration,
            ]),
            
            ("Phase 2: Categories & Skill Creation", [
                self.test_predefined_categories,
                self.test_user_categories,
                self.test_skill_creation_predefined_category,
            ]),
            
            ("Phase 3: Time Logging & Live Updates", [
                self.test_time_logging_with_live_updates,
            ]),
            
            ("Phase 4: Quest System", [
                self.test_quest_system,
            ]),
            
            ("Phase 5: Settings & Reset", [
                self.test_user_settings,
                self.test_reset_functionality,
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
        print(f"🏁 TEST SUMMARY")
        print(f"📊 Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {total_tests - passed_tests}")
        print(f"📈 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if passed_tests == total_tests:
            print("🎉 ALL TESTS PASSED! Backend is working correctly.")
            return True
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return False

def main():
    """Main test runner"""
    # Read the actual backend URL from frontend .env
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    global BACKEND_URL, API_BASE_URL
                    BACKEND_URL = line.split('=', 1)[1].strip()
                    API_BASE_URL = f"{BACKEND_URL}/api"
                    break
    except:
        print("Warning: Could not read frontend .env, using default localhost:8001")
    
    print(f"Using Backend URL: {BACKEND_URL}")
    
    tester = GalacticQuestTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())