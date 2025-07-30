#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Galactic Quest - Focus on Recent Changes
Tests the specific features mentioned in the review request:
1. Predefined categories functionality
2. Leaderboard rankings
3. Quest system
4. Settings toggle
5. User registration with predefined categories
"""

import requests
import json
import sys
from datetime import datetime

# Use the public backend URL from frontend .env
BACKEND_URL = "http://localhost:8001"
API_BASE_URL = f"{BACKEND_URL}/api"

class GalacticQuestAPITester:
    def __init__(self):
        self.auth_token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, message, details=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            'test': name,
            'success': success,
            'message': message,
            'details': details or {}
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {name}")
        print(f"   {message}")
        if details:
            print(f"   Details: {details}")

    def make_request(self, method, endpoint, data=None, expected_status=200):
        """Make HTTP request and return (success, response_data)"""
        url = f"{API_BASE_URL}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.auth_token:
            headers['Authorization'] = f'Bearer {self.auth_token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            try:
                response_data = response.json()
            except:
                response_data = {'status_code': response.status_code, 'text': response.text}
            
            return success, response_data
        except Exception as e:
            return False, {'error': str(e)}

    def test_health_check(self):
        """Test API health check"""
        success, response = self.make_request('GET', '/health')
        
        if success and response.get('status') == 'healthy':
            self.log_test("Health Check", True, "API is healthy and responding")
            return True
        else:
            self.log_test("Health Check", False, f"Health check failed: {response}")
            return False

    def test_user_registration_with_predefined_categories(self):
        """Test user registration - should create predefined categories automatically"""
        user_data = {
            "username": "TestUser2",
            "email": "test2@example.com",
            "password": "password123",
            "avatar": "🚀"
        }
        
        success, response = self.make_request('POST', '/auth/register', user_data)
        
        if success and 'access_token' in response:
            self.auth_token = response['access_token']
            self.user_data = response
            self.log_test(
                "User Registration", 
                True, 
                f"Successfully registered user: {response['username']}",
                {'user_id': response['id'], 'total_xp': response['total_xp']}
            )
            return True
        else:
            self.log_test(
                "User Registration", 
                False, 
                f"Registration failed: {response.get('detail', 'Unknown error')}",
                response
            )
            return False

    def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": "test2@example.com",
            "password": "password123"
        }
        
        success, response = self.make_request('POST', '/auth/login', login_data)
        
        if success and 'access_token' in response:
            self.auth_token = response['access_token']
            self.user_data = response
            self.log_test(
                "User Login", 
                True, 
                f"Successfully logged in user: {response['username']}"
            )
            return True
        else:
            self.log_test(
                "User Login", 
                False, 
                f"Login failed: {response.get('detail', 'Unknown error')}"
            )
            return False

    def test_predefined_categories_api(self):
        """Test GET /api/categories/predefined - should return 6 default categories"""
        success, response = self.make_request('GET', '/categories/predefined')
        
        if success and isinstance(response, list):
            expected_categories = ['Mind', 'Body', 'Creativity', 'Productivity', 'Social', 'Spiritual']
            category_names = [cat.get('name', '') for cat in response]
            
            if len(response) >= 6:
                self.log_test(
                    "Predefined Categories API", 
                    True, 
                    f"Retrieved {len(response)} predefined categories",
                    {'categories': category_names[:6]}
                )
                return True
            else:
                self.log_test(
                    "Predefined Categories API", 
                    False, 
                    f"Expected at least 6 categories, got {len(response)}",
                    {'categories': category_names}
                )
                return False
        else:
            self.log_test(
                "Predefined Categories API", 
                False, 
                f"Failed to get predefined categories: {response}"
            )
            return False

    def test_user_categories_api(self):
        """Test GET /api/categories - should return user's categories (predefined by default)"""
        success, response = self.make_request('GET', '/categories')
        
        if success and isinstance(response, list):
            if len(response) >= 6:
                category_names = [cat.get('name', '') for cat in response]
                self.log_test(
                    "User Categories API", 
                    True, 
                    f"User has {len(response)} categories available",
                    {'categories': category_names[:6]}
                )
                self.user_categories = response
                return True
            else:
                self.log_test(
                    "User Categories API", 
                    False, 
                    f"Expected user to have predefined categories, got {len(response)}",
                    {'categories': [cat.get('name', '') for cat in response]}
                )
                return False
        else:
            self.log_test(
                "User Categories API", 
                False, 
                f"Failed to get user categories: {response}"
            )
            return False

    def test_settings_api_get(self):
        """Test GET /api/settings - should return user settings"""
        success, response = self.make_request('GET', '/settings')
        
        if success and 'use_predefined_categories' in response:
            self.log_test(
                "Settings API (GET)", 
                True, 
                f"Retrieved user settings",
                {
                    'use_predefined_categories': response.get('use_predefined_categories'),
                    'notifications': response.get('notifications'),
                    'theme': response.get('theme')
                }
            )
            self.user_settings = response
            return True
        else:
            self.log_test(
                "Settings API (GET)", 
                False, 
                f"Failed to get user settings: {response}"
            )
            return False

    def test_settings_api_update(self):
        """Test PATCH /api/settings - should update user settings"""
        settings_update = {
            "use_predefined_categories": False,
            "notifications": True,
            "theme": "dark"
        }
        
        success, response = self.make_request('PATCH', '/settings', settings_update)
        
        if success and response.get('message'):
            self.log_test(
                "Settings API (PATCH)", 
                True, 
                f"Successfully updated settings: {response['message']}"
            )
            return True
        else:
            self.log_test(
                "Settings API (PATCH)", 
                False, 
                f"Failed to update settings: {response}"
            )
            return False

    def test_quests_api(self):
        """Test GET /api/quests - should return daily/weekly quests"""
        success, response = self.make_request('GET', '/quests')
        
        if success and isinstance(response, dict):
            daily_quests = response.get('daily_quests', [])
            weekly_quests = response.get('weekly_quests', [])
            
            if daily_quests or weekly_quests:
                self.log_test(
                    "Quests API", 
                    True, 
                    f"Retrieved quests: {len(daily_quests)} daily, {len(weekly_quests)} weekly",
                    {
                        'daily_count': len(daily_quests),
                        'weekly_count': len(weekly_quests),
                        'sample_daily': daily_quests[0].get('title', '') if daily_quests else 'None'
                    }
                )
                return True
            else:
                self.log_test(
                    "Quests API", 
                    False, 
                    "No quests returned",
                    response
                )
                return False
        else:
            self.log_test(
                "Quests API", 
                False, 
                f"Failed to get quests: {response}"
            )
            return False

    def test_leaderboard_api(self):
        """Test GET /api/leaderboard - should return leaderboard with proper rankings"""
        success, response = self.make_request('GET', '/leaderboard')
        
        if success and 'entries' in response:
            entries = response['entries']
            user_position = response.get('user_position')
            
            # Check if rankings are properly set (not "loading rank")
            rankings_valid = True
            for entry in entries[:5]:  # Check first 5 entries
                if 'position' not in entry or entry['position'] is None:
                    rankings_valid = False
                    break
            
            if rankings_valid:
                self.log_test(
                    "Leaderboard API", 
                    True, 
                    f"Leaderboard has {len(entries)} entries with proper rankings",
                    {
                        'total_entries': len(entries),
                        'user_position': user_position,
                        'top_player': entries[0].get('username', '') if entries else 'None'
                    }
                )
                return True
            else:
                self.log_test(
                    "Leaderboard API", 
                    False, 
                    "Leaderboard rankings are not properly set",
                    {'entries_sample': entries[:3]}
                )
                return False
        else:
            self.log_test(
                "Leaderboard API", 
                False, 
                f"Failed to get leaderboard: {response}"
            )
            return False

    def test_achievements_api(self):
        """Test GET /api/achievements - should return user achievements"""
        success, response = self.make_request('GET', '/achievements')
        
        if success and isinstance(response, list):
            locked_achievements = [ach for ach in response if not ach.get('unlocked', False)]
            unlocked_achievements = [ach for ach in response if ach.get('unlocked', False)]
            
            self.log_test(
                "Achievements API", 
                True, 
                f"Retrieved {len(response)} achievements",
                {
                    'total': len(response),
                    'unlocked': len(unlocked_achievements),
                    'locked': len(locked_achievements)
                }
            )
            return True
        else:
            self.log_test(
                "Achievements API", 
                False, 
                f"Failed to get achievements: {response}"
            )
            return False

    def test_create_skill_with_predefined_category(self):
        """Test creating a skill using predefined categories"""
        if not hasattr(self, 'user_categories') or not self.user_categories:
            self.log_test(
                "Create Skill with Predefined Category", 
                False, 
                "No categories available for skill creation"
            )
            return False
        
        # Use the first available category
        category = self.user_categories[0]
        skill_data = {
            "name": "Test Programming Skill",
            "category_id": category['id'],
            "difficulty": "medium",
            "icon": "💻",
            "description": "Testing skill creation with predefined category"
        }
        
        success, response = self.make_request('POST', '/skills', skill_data)
        
        if success and 'id' in response:
            self.test_skill_id = response['id']
            self.log_test(
                "Create Skill with Predefined Category", 
                True, 
                f"Successfully created skill: {response['name']}",
                {
                    'skill_id': response['id'],
                    'category': category['name'],
                    'difficulty': response['difficulty']
                }
            )
            return True
        else:
            self.log_test(
                "Create Skill with Predefined Category", 
                False, 
                f"Failed to create skill: {response}"
            )
            return False

    def test_time_logging_for_quest_progress(self):
        """Test time logging to verify quest progress tracking"""
        if not hasattr(self, 'test_skill_id'):
            self.log_test(
                "Time Logging for Quest Progress", 
                False, 
                "No skill available for time logging"
            )
            return False
        
        time_data = {
            "skill_id": self.test_skill_id,
            "minutes": 30,
            "note": "Testing quest progress tracking"
        }
        
        success, response = self.make_request('POST', '/time-logs', time_data)
        
        if success and 'xp_earned' in response:
            self.log_test(
                "Time Logging for Quest Progress", 
                True, 
                f"Logged {response['minutes']} minutes, earned {response['xp_earned']} XP",
                {
                    'skill_id': response['skill_id'],
                    'xp_earned': response['xp_earned']
                }
            )
            return True
        else:
            self.log_test(
                "Time Logging for Quest Progress", 
                False, 
                f"Failed to log time: {response}"
            )
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Galactic Quest Comprehensive Backend API Tests")
        print(f"📡 Testing API at: {API_BASE_URL}")
        print("🎯 Focus: Recent changes - predefined categories, leaderboard, quests, settings")
        print("=" * 80)
        
        # Test sequence focusing on recent changes
        tests = [
            ("Health Check", self.test_health_check),
            ("User Registration with Predefined Categories", self.test_user_registration_with_predefined_categories),
            ("User Login", self.test_user_login),
            ("Predefined Categories API", self.test_predefined_categories_api),
            ("User Categories API", self.test_user_categories_api),
            ("Settings API (GET)", self.test_settings_api_get),
            ("Settings API (PATCH)", self.test_settings_api_update),
            ("Quests API", self.test_quests_api),
            ("Leaderboard API", self.test_leaderboard_api),
            ("Achievements API", self.test_achievements_api),
            ("Create Skill with Predefined Category", self.test_create_skill_with_predefined_category),
            ("Time Logging for Quest Progress", self.test_time_logging_for_quest_progress),
        ]
        
        print("\n📋 Running Backend API Tests")
        print("-" * 50)
        
        for test_name, test_func in tests:
            try:
                test_func()
            except Exception as e:
                self.log_test(test_name, False, f"Test crashed: {str(e)}")
        
        # Summary
        print("\n" + "=" * 80)
        print(f"🏁 BACKEND TEST SUMMARY")
        print(f"📊 Total Tests: {self.tests_run}")
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {self.tests_run - self.tests_passed}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 ALL BACKEND TESTS PASSED! Ready for frontend testing.")
            return True
        else:
            print("⚠️  Some backend tests failed. Check details above.")
            return False

def main():
    """Main test runner"""
    tester = GalacticQuestAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())