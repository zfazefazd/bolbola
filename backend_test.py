#!/usr/bin/env python3
"""
Comprehensive Backend API Tests for Galactic Quest Skill Tracking App

Tests the following core functionalities:
1. User Registration & Authentication
2. Skill Creation & Management  
3. Time Logging & XP System
"""

import asyncio
import aiohttp
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional

# Get backend URL from environment - use localhost for testing
BACKEND_URL = "http://localhost:8001"
API_BASE_URL = f"{BACKEND_URL}/api"

class GalacticQuestTester:
    def __init__(self):
        self.session = None
        self.auth_token = None
        self.user_data = None
        self.test_results = []
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, message: str, details: Dict = None):
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
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> tuple[bool, Dict]:
        """Make HTTP request and return (success, response_data)"""
        url = f"{API_BASE_URL}{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        
        if self.auth_token:
            request_headers['Authorization'] = f"Bearer {self.auth_token}"
        
        if headers:
            request_headers.update(headers)
        
        try:
            async with self.session.request(
                method, 
                url, 
                json=data if data else None,
                headers=request_headers
            ) as response:
                response_data = await response.json()
                return response.status < 400, response_data
        except Exception as e:
            return False, {'error': str(e)}
    
    # ========== USER REGISTRATION & AUTHENTICATION TESTS ==========
    
    async def test_user_registration(self):
        """Test user registration with valid data"""
        test_user = {
            "username": "galactic_explorer",
            "email": "explorer@galacticquest.com", 
            "password": "SecurePass123!",
            "avatar": "🚀"
        }
        
        success, response = await self.make_request('POST', '/auth/register', test_user)
        
        if success and 'access_token' in response:
            self.auth_token = response['access_token']
            self.user_data = response
            self.log_result(
                "User Registration", 
                True, 
                f"Successfully registered user: {response['username']}",
                {'user_id': response['id'], 'rank': response['current_rank']}
            )
        else:
            self.log_result(
                "User Registration", 
                False, 
                f"Registration failed: {response.get('detail', 'Unknown error')}",
                response
            )
        
        return success
    
    async def test_duplicate_registration(self):
        """Test duplicate user registration prevention"""
        duplicate_user = {
            "username": "galactic_explorer",  # Same username
            "email": "explorer@galacticquest.com",  # Same email
            "password": "AnotherPass456!",
            "avatar": "🌟"
        }
        
        success, response = await self.make_request('POST', '/auth/register', duplicate_user)
        
        # Should fail with 400 status
        if not success and 'already' in response.get('detail', '').lower():
            self.log_result(
                "Duplicate Registration Prevention", 
                True, 
                "Correctly prevented duplicate registration",
                {'error_message': response.get('detail')}
            )
            return True
        else:
            self.log_result(
                "Duplicate Registration Prevention", 
                False, 
                "Failed to prevent duplicate registration",
                response
            )
            return False
    
    async def test_user_login(self):
        """Test user login with correct credentials"""
        login_data = {
            "email": "explorer@galacticquest.com",
            "password": "SecurePass123!"
        }
        
        success, response = await self.make_request('POST', '/auth/login', login_data)
        
        if success and 'access_token' in response:
            # Update token for subsequent tests
            self.auth_token = response['access_token']
            self.log_result(
                "User Login", 
                True, 
                f"Successfully logged in user: {response['username']}",
                {'token_type': response.get('token_type')}
            )
            return True
        else:
            self.log_result(
                "User Login", 
                False, 
                f"Login failed: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    async def test_invalid_login(self):
        """Test login with incorrect credentials"""
        invalid_login = {
            "email": "explorer@galacticquest.com",
            "password": "WrongPassword123!"
        }
        
        success, response = await self.make_request('POST', '/auth/login', invalid_login)
        
        # Should fail with 401 status
        if not success and ('incorrect' in response.get('detail', '').lower() or 
                           'unauthorized' in response.get('detail', '').lower()):
            self.log_result(
                "Invalid Login Prevention", 
                True, 
                "Correctly rejected invalid credentials",
                {'error_message': response.get('detail')}
            )
            return True
        else:
            self.log_result(
                "Invalid Login Prevention", 
                False, 
                "Failed to reject invalid credentials",
                response
            )
            return False
    
    async def test_token_validation(self):
        """Test authentication token validation"""
        success, response = await self.make_request('GET', '/auth/me')
        
        if success and 'username' in response:
            self.log_result(
                "Token Validation", 
                True, 
                f"Token validated successfully for user: {response['username']}",
                {'user_id': response['id'], 'total_xp': response['total_xp']}
            )
            return True
        else:
            self.log_result(
                "Token Validation", 
                False, 
                f"Token validation failed: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    # ========== SKILL CREATION & MANAGEMENT TESTS ==========
    
    async def test_create_category(self):
        """Test creating a skill category"""
        category_data = {
            "name": "Programming",
            "icon": "💻",
            "color": "#00BFA6",
            "description": "Software development and coding skills"
        }
        
        success, response = await self.make_request('POST', '/categories', category_data)
        
        if success and 'id' in response:
            self.category_id = response['id']
            self.log_result(
                "Category Creation", 
                True, 
                f"Successfully created category: {response['name']}",
                {'category_id': response['id'], 'color': response['color']}
            )
            return True
        else:
            self.log_result(
                "Category Creation", 
                False, 
                f"Category creation failed: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    async def test_create_skill(self):
        """Test creating skills with different difficulty levels"""
        skills_to_create = [
            {
                "name": "Python Programming",
                "category_id": getattr(self, 'category_id', 'test-category'),
                "difficulty": "medium",
                "icon": "🐍",
                "description": "Learning Python programming language"
            },
            {
                "name": "Advanced Algorithms",
                "category_id": getattr(self, 'category_id', 'test-category'),
                "difficulty": "hard",
                "icon": "🧮",
                "description": "Complex algorithmic problem solving"
            },
            {
                "name": "Code Review",
                "category_id": getattr(self, 'category_id', 'test-category'),
                "difficulty": "easy",
                "icon": "👀",
                "description": "Reviewing and improving code quality"
            }
        ]
        
        self.created_skills = []
        all_success = True
        
        for skill_data in skills_to_create:
            success, response = await self.make_request('POST', '/skills', skill_data)
            
            if success and 'id' in response:
                self.created_skills.append(response)
                self.log_result(
                    f"Skill Creation ({skill_data['difficulty']})", 
                    True, 
                    f"Created skill: {response['name']}",
                    {'skill_id': response['id'], 'difficulty': response['difficulty']}
                )
            else:
                all_success = False
                self.log_result(
                    f"Skill Creation ({skill_data['difficulty']})", 
                    False, 
                    f"Failed to create skill: {response.get('detail', 'Unknown error')}",
                    response
                )
        
        return all_success
    
    async def test_retrieve_skills(self):
        """Test retrieving user skills"""
        success, response = await self.make_request('GET', '/skills')
        
        if success and isinstance(response, list):
            skill_count = len(response)
            self.log_result(
                "Skill Retrieval", 
                True, 
                f"Successfully retrieved {skill_count} skills",
                {'skills': [{'name': s['name'], 'difficulty': s['difficulty']} for s in response[:3]]}
            )
            return True
        else:
            self.log_result(
                "Skill Retrieval", 
                False, 
                f"Failed to retrieve skills: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    async def test_update_skill(self):
        """Test updating skill information"""
        if not hasattr(self, 'created_skills') or not self.created_skills:
            self.log_result("Skill Update", False, "No skills available to update", {})
            return False
        
        skill_to_update = self.created_skills[0]
        update_data = {
            "name": "Advanced Python Programming",
            "difficulty": "hard",
            "description": "Updated description for advanced Python skills"
        }
        
        success, response = await self.make_request(
            'PUT', 
            f'/skills/{skill_to_update["id"]}', 
            update_data
        )
        
        if success and response.get('name') == update_data['name']:
            self.log_result(
                "Skill Update", 
                True, 
                f"Successfully updated skill to: {response['name']}",
                {'old_difficulty': skill_to_update['difficulty'], 'new_difficulty': response['difficulty']}
            )
            return True
        else:
            self.log_result(
                "Skill Update", 
                False, 
                f"Failed to update skill: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    async def test_delete_skill(self):
        """Test deleting a skill"""
        if not hasattr(self, 'created_skills') or len(self.created_skills) < 2:
            self.log_result("Skill Deletion", False, "Not enough skills available to delete", {})
            return False
        
        skill_to_delete = self.created_skills[-1]  # Delete the last created skill
        
        success, response = await self.make_request('DELETE', f'/skills/{skill_to_delete["id"]}')
        
        if success and response.get('message'):
            self.log_result(
                "Skill Deletion", 
                True, 
                f"Successfully deleted skill: {skill_to_delete['name']}",
                {'deleted_skill_id': skill_to_delete['id']}
            )
            return True
        else:
            self.log_result(
                "Skill Deletion", 
                False, 
                f"Failed to delete skill: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    # ========== TIME LOGGING & XP SYSTEM TESTS ==========
    
    async def test_time_logging(self):
        """Test logging time for skills with XP calculation"""
        if not hasattr(self, 'created_skills') or not self.created_skills:
            self.log_result("Time Logging", False, "No skills available for time logging", {})
            return False
        
        time_logs = [
            {
                "skill_id": self.created_skills[0]['id'],
                "minutes": 60,
                "note": "Completed Python tutorial chapter 1"
            },
            {
                "skill_id": self.created_skills[1]['id'] if len(self.created_skills) > 1 else self.created_skills[0]['id'],
                "minutes": 120,
                "note": "Solved 5 algorithm problems"
            }
        ]
        
        self.logged_times = []
        all_success = True
        
        for log_data in time_logs:
            success, response = await self.make_request('POST', '/time-logs', log_data)
            
            if success and 'xp_earned' in response:
                self.logged_times.append(response)
                self.log_result(
                    "Time Logging", 
                    True, 
                    f"Logged {response['minutes']} minutes, earned {response['xp_earned']} XP",
                    {'skill_id': response['skill_id'], 'note': response.get('note', '')}
                )
            else:
                all_success = False
                self.log_result(
                    "Time Logging", 
                    False, 
                    f"Failed to log time: {response.get('detail', 'Unknown error')}",
                    response
                )
        
        return all_success
    
    async def test_xp_calculation(self):
        """Test XP calculation based on difficulty levels"""
        if not hasattr(self, 'logged_times') or not self.logged_times:
            self.log_result("XP Calculation", False, "No time logs available to verify XP", {})
            return False
        
        # Verify XP calculation logic
        expected_multipliers = {
            'trivial': 1.0,
            'easy': 1.5,
            'medium': 2.0,
            'hard': 2.5,
            'extreme': 3.0,
            'legendary': 3.5
        }
        
        all_correct = True
        for log in self.logged_times:
            # Get the skill to check its difficulty
            skill_id = log['skill_id']
            skill = next((s for s in self.created_skills if s['id'] == skill_id), None)
            
            if skill:
                expected_xp = int(log['minutes'] * expected_multipliers.get(skill['difficulty'], 1.0))
                actual_xp = log['xp_earned']
                
                if expected_xp == actual_xp:
                    self.log_result(
                        "XP Calculation", 
                        True, 
                        f"Correct XP calculation: {log['minutes']}min × {skill['difficulty']} = {actual_xp} XP",
                        {'skill_difficulty': skill['difficulty'], 'multiplier': expected_multipliers.get(skill['difficulty'])}
                    )
                else:
                    all_correct = False
                    self.log_result(
                        "XP Calculation", 
                        False, 
                        f"Incorrect XP: expected {expected_xp}, got {actual_xp}",
                        {'skill_difficulty': skill['difficulty'], 'minutes': log['minutes']}
                    )
        
        return all_correct
    
    async def test_skill_statistics_update(self):
        """Test skill statistics updates (total time, XP, streak)"""
        success, response = await self.make_request('GET', '/skills')
        
        if not success or not isinstance(response, list):
            self.log_result("Skill Statistics", False, "Failed to retrieve updated skills", response)
            return False
        
        updated_skills = response
        stats_correct = True
        
        for skill in updated_skills:
            if skill['total_time_minutes'] > 0 or skill['total_xp'] > 0:
                self.log_result(
                    "Skill Statistics Update", 
                    True, 
                    f"Skill '{skill['name']}': {skill['total_time_minutes']}min, {skill['total_xp']} XP, streak: {skill['streak']}",
                    {
                        'skill_id': skill['id'],
                        'last_logged': skill.get('last_logged_at'),
                        'difficulty': skill['difficulty']
                    }
                )
            else:
                # This skill hasn't been logged to yet, which is fine
                pass
        
        return stats_correct
    
    async def test_user_rank_progression(self):
        """Test user rank progression based on total XP"""
        success, response = await self.make_request('GET', '/auth/me')
        
        if success and 'current_rank' in response:
            current_rank = response['current_rank']
            total_xp = response['total_xp']
            
            # Verify rank makes sense for XP amount
            rank_valid = total_xp >= current_rank.get('min_xp', 0)
            
            self.log_result(
                "User Rank Progression", 
                rank_valid, 
                f"User rank: {current_rank.get('tier', 'Unknown')} {current_rank.get('division', '')} with {total_xp} XP",
                {
                    'rank_tier': current_rank.get('tier'),
                    'rank_division': current_rank.get('division'),
                    'total_xp': total_xp,
                    'rank_min_xp': current_rank.get('min_xp'),
                    'rank_max_xp': current_rank.get('max_xp')
                }
            )
            return rank_valid
        else:
            self.log_result(
                "User Rank Progression", 
                False, 
                f"Failed to get user rank: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    async def test_time_logs_retrieval(self):
        """Test retrieving time logs"""
        success, response = await self.make_request('GET', '/time-logs')
        
        if success and isinstance(response, list):
            log_count = len(response)
            self.log_result(
                "Time Logs Retrieval", 
                True, 
                f"Successfully retrieved {log_count} time logs",
                {'recent_logs': [{'minutes': log['minutes'], 'xp_earned': log['xp_earned']} for log in response[:3]]}
            )
            return True
        else:
            self.log_result(
                "Time Logs Retrieval", 
                False, 
                f"Failed to retrieve time logs: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    # ========== ADDITIONAL API TESTS ==========
    
    async def test_user_stats(self):
        """Test user statistics endpoint"""
        success, response = await self.make_request('GET', '/stats/user')
        
        if success and 'total_skills' in response:
            self.log_result(
                "User Statistics", 
                True, 
                f"Stats: {response['total_skills']} skills, {response['total_time_minutes']} minutes, {response['total_xp']} XP",
                {
                    'total_logs': response.get('total_logs'),
                    'current_streak': response.get('current_streak'),
                    'avg_xp_per_skill': response.get('avg_xp_per_skill')
                }
            )
            return True
        else:
            self.log_result(
                "User Statistics", 
                False, 
                f"Failed to get user stats: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    async def test_leaderboard(self):
        """Test leaderboard endpoint"""
        success, response = await self.make_request('GET', '/leaderboard')
        
        if success and 'entries' in response:
            entry_count = len(response['entries'])
            user_position = response.get('user_position', 'Unknown')
            self.log_result(
                "Leaderboard", 
                True, 
                f"Leaderboard has {entry_count} entries, user position: {user_position}",
                {
                    'total_players': response.get('total_players'),
                    'top_player': response['entries'][0]['username'] if response['entries'] else None
                }
            )
            return True
        else:
            self.log_result(
                "Leaderboard", 
                False, 
                f"Failed to get leaderboard: {response.get('detail', 'Unknown error')}",
                response
            )
            return False
    
    async def test_health_check(self):
        """Test API health check"""
        success, response = await self.make_request('GET', '/health')
        
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
    
    # ========== MAIN TEST RUNNER ==========
    
    async def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"\n🚀 Starting Galactic Quest Backend API Tests")
        print(f"📡 Testing API at: {API_BASE_URL}")
        print("=" * 80)
        
        # Test sequence
        test_sequence = [
            # Authentication Tests
            ("User Registration & Authentication", [
                self.test_health_check,
                self.test_user_registration,
                self.test_duplicate_registration,
                self.test_user_login,
                self.test_invalid_login,
                self.test_token_validation,
            ]),
            
            # Skill Management Tests
            ("Skill Creation & Management", [
                self.test_create_category,
                self.test_create_skill,
                self.test_retrieve_skills,
                self.test_update_skill,
                self.test_delete_skill,
            ]),
            
            # Time Logging & XP Tests
            ("Time Logging & XP System", [
                self.test_time_logging,
                self.test_xp_calculation,
                self.test_skill_statistics_update,
                self.test_user_rank_progression,
                self.test_time_logs_retrieval,
            ]),
            
            # Additional API Tests
            ("Additional Features", [
                self.test_user_stats,
                self.test_leaderboard,
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
                    result = await test_func()
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
        else:
            print("⚠️  Some tests failed. Check the details above.")
        
        return passed_tests, total_tests

async def main():
    """Main test runner"""
    async with GalacticQuestTester() as tester:
        await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())