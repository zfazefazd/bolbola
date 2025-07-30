#!/usr/bin/env python3
"""
Simple Backend API Tests for Galactic Quest Skill Tracking App
"""

import requests
import json
import sys
from datetime import datetime

# Get backend URL from environment - use localhost for testing
BACKEND_URL = "http://localhost:8001"
API_BASE_URL = f"{BACKEND_URL}/api"

class SimpleAPITester:
    def __init__(self):
        self.auth_token = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{API_BASE_URL}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.auth_token:
            headers['Authorization'] = f'Bearer {self.auth_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    return False, response.json()
                except:
                    return False, {'error': response.text}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {'error': str(e)}

    def test_health_check(self):
        """Test API health check"""
        success, response = self.run_test("Health Check", "GET", "/health", 200)
        return success

    def test_register_user(self):
        """Test user registration"""
        user_data = {
            "username": f"test_user_{datetime.now().strftime('%H%M%S')}",
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!",
            "avatar": "🚀"
        }
        
        success, response = self.run_test("User Registration", "POST", "/auth/register", 200, user_data)
        if success and 'access_token' in response:
            self.auth_token = response['access_token']
            self.user_data = response
            print(f"   Registered user: {response.get('username')}")
            return True
        return False

    def test_login_user(self):
        """Test user login"""
        if not hasattr(self, 'user_data'):
            print("❌ No user data available for login test")
            return False
            
        login_data = {
            "email": self.user_data['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test("User Login", "POST", "/auth/login", 200, login_data)
        if success and 'access_token' in response:
            self.auth_token = response['access_token']
            print(f"   Logged in user: {response.get('username')}")
            return True
        return False

    def test_get_user_profile(self):
        """Test getting user profile"""
        success, response = self.run_test("Get User Profile", "GET", "/auth/me", 200)
        if success:
            print(f"   User: {response.get('username')}, XP: {response.get('total_xp', 0)}")
        return success

    def test_create_category(self):
        """Test creating a category"""
        category_data = {
            "name": "Programming",
            "icon": "💻",
            "color": "#00BFA6",
            "description": "Software development skills"
        }
        
        success, response = self.run_test("Create Category", "POST", "/categories", 200, category_data)
        if success and 'id' in response:
            self.category_id = response['id']
            print(f"   Created category: {response.get('name')}")
            return True
        return False

    def test_create_skill(self):
        """Test creating a skill"""
        if not hasattr(self, 'category_id'):
            print("❌ No category available for skill creation")
            return False
            
        skill_data = {
            "name": "Python Programming",
            "category_id": self.category_id,
            "difficulty": "medium",
            "icon": "🐍",
            "description": "Learning Python programming"
        }
        
        success, response = self.run_test("Create Skill", "POST", "/skills", 200, skill_data)
        if success and 'id' in response:
            self.skill_id = response['id']
            print(f"   Created skill: {response.get('name')}")
            return True
        return False

    def test_get_skills(self):
        """Test getting skills"""
        success, response = self.run_test("Get Skills", "GET", "/skills", 200)
        if success and isinstance(response, list):
            print(f"   Retrieved {len(response)} skills")
        return success

    def test_log_time(self):
        """Test logging time for a skill"""
        if not hasattr(self, 'skill_id'):
            print("❌ No skill available for time logging")
            return False
            
        time_data = {
            "skill_id": self.skill_id,
            "minutes": 60,
            "note": "Test time logging"
        }
        
        success, response = self.run_test("Log Time", "POST", "/time-logs", 200, time_data)
        if success:
            print(f"   Logged {response.get('minutes')} minutes, earned {response.get('xp_earned')} XP")
        return success

    def test_get_leaderboard(self):
        """Test getting leaderboard"""
        success, response = self.run_test("Get Leaderboard", "GET", "/leaderboard", 200)
        if success and 'entries' in response:
            print(f"   Leaderboard has {len(response['entries'])} entries")
        return success

    def test_get_user_stats(self):
        """Test getting user statistics"""
        success, response = self.run_test("Get User Stats", "GET", "/stats/user", 200)
        if success:
            print(f"   Stats: {response.get('total_skills', 0)} skills, {response.get('total_xp', 0)} XP")
        return success

def main():
    """Main test runner"""
    print("🚀 Starting Galactic Quest Backend API Tests")
    print(f"📡 Testing API at: {API_BASE_URL}")
    print("=" * 60)
    
    tester = SimpleAPITester()
    
    # Run tests in sequence
    tests = [
        tester.test_health_check,
        tester.test_register_user,
        tester.test_login_user,
        tester.test_get_user_profile,
        tester.test_create_category,
        tester.test_create_skill,
        tester.test_get_skills,
        tester.test_log_time,
        tester.test_get_leaderboard,
        tester.test_get_user_stats,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {str(e)}")
    
    # Print results
    print("\n" + "=" * 60)
    print(f"🏁 TEST SUMMARY")
    print(f"📊 Total Tests: {tester.tests_run}")
    print(f"✅ Passed: {tester.tests_passed}")
    print(f"❌ Failed: {tester.tests_run - tester.tests_passed}")
    print(f"📈 Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 ALL TESTS PASSED! Backend is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the details above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())