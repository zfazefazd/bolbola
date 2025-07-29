from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import uuid
from .models import *
from .auth import AuthService

class SkillService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_skill(self, user_id: str, skill_data: SkillCreate) -> Skill:
        """Create a new skill for the user."""
        skill_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        skill_doc = {
            "_id": skill_id,
            "name": skill_data.name,
            "category_id": skill_data.category_id,
            "difficulty": skill_data.difficulty.value,
            "icon": skill_data.icon,
            "description": skill_data.description,
            "total_time_minutes": 0,
            "total_xp": 0,
            "streak": 0,
            "last_logged_at": None,
            "user_id": user_id,
            "created_at": now,
            "updated_at": now
        }
        
        await self.db.skills.insert_one(skill_doc)
        return Skill(**skill_doc, id=skill_id)
    
    async def get_user_skills(self, user_id: str) -> List[Skill]:
        """Get all skills for a user."""
        cursor = self.db.skills.find({"user_id": user_id}).sort("created_at", 1)
        skills = []
        async for skill_doc in cursor:
            skills.append(Skill(**skill_doc, id=skill_doc["_id"]))
        return skills
    
    async def update_skill(self, user_id: str, skill_id: str, skill_data: SkillUpdate) -> Optional[Skill]:
        """Update a skill."""
        update_data = {k: v for k, v in skill_data.dict().items() if v is not None}
        if not update_data:
            return None
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.db.skills.update_one(
            {"_id": skill_id, "user_id": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            return None
        
        skill_doc = await self.db.skills.find_one({"_id": skill_id})
        return Skill(**skill_doc, id=skill_doc["_id"]) if skill_doc else None
    
    async def delete_skill(self, user_id: str, skill_id: str) -> bool:
        """Delete a skill and all its associated time logs."""
        # Delete associated time logs
        await self.db.time_logs.delete_many({"skill_id": skill_id, "user_id": user_id})
        
        # Delete the skill
        result = await self.db.skills.delete_one({"_id": skill_id, "user_id": user_id})
        return result.deleted_count > 0

class CategoryService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def create_category(self, user_id: str, category_data: CategoryCreate) -> Category:
        """Create a new category for the user."""
        category_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        category_doc = {
            "_id": category_id,
            "name": category_data.name,
            "icon": category_data.icon,
            "color": category_data.color,
            "description": category_data.description,
            "user_id": user_id,
            "created_at": now
        }
        
        await self.db.categories.insert_one(category_doc)
        return Category(**category_doc, id=category_id)
    
    async def get_user_categories(self, user_id: str) -> List[Category]:
        """Get all categories for a user."""
        cursor = self.db.categories.find({"user_id": user_id}).sort("created_at", 1)
        categories = []
        async for category_doc in cursor:
            categories.append(Category(**category_doc, id=category_doc["_id"]))
        return categories
    
    async def delete_category(self, user_id: str, category_id: str) -> bool:
        """Delete a category and all its associated skills and time logs."""
        # Get all skills in this category
        skills_cursor = self.db.skills.find({"category_id": category_id, "user_id": user_id})
        skill_ids = [skill["_id"] async for skill in skills_cursor]
        
        # Delete all time logs for skills in this category
        if skill_ids:
            await self.db.time_logs.delete_many({"skill_id": {"$in": skill_ids}, "user_id": user_id})
        
        # Delete all skills in this category
        await self.db.skills.delete_many({"category_id": category_id, "user_id": user_id})
        
        # Delete the category
        result = await self.db.categories.delete_one({"_id": category_id, "user_id": user_id})
        return result.deleted_count > 0

class TimeLogService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.auth_service = AuthService(db)
    
    def calculate_xp(self, minutes: int, difficulty: str) -> int:
        """Calculate XP based on time and difficulty."""
        multipliers = {
            "trivial": 1.0,
            "easy": 1.5,
            "medium": 2.0,
            "hard": 2.5,
            "extreme": 3.0,
            "legendary": 3.5
        }
        return int(minutes * multipliers.get(difficulty, 1.0))
    
    async def log_time(self, user_id: str, time_log_data: TimeLogCreate) -> TimeLog:
        """Log time for a skill and update user stats."""
        # Get the skill
        skill = await self.db.skills.find_one({"_id": time_log_data.skill_id, "user_id": user_id})
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        
        # Calculate XP
        xp_earned = self.calculate_xp(time_log_data.minutes, skill["difficulty"])
        
        # Create time log
        time_log_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        time_log_doc = {
            "_id": time_log_id,
            "skill_id": time_log_data.skill_id,
            "minutes": time_log_data.minutes,
            "xp_earned": xp_earned,
            "note": time_log_data.note,
            "user_id": user_id,
            "logged_at": now
        }
        
        await self.db.time_logs.insert_one(time_log_doc)
        
        # Update skill stats
        new_total_time = skill["total_time_minutes"] + time_log_data.minutes
        new_total_xp = skill["total_xp"] + xp_earned
        
        # Calculate streak (simple implementation - increment if logged today)
        new_streak = skill["streak"] + 1
        
        await self.db.skills.update_one(
            {"_id": time_log_data.skill_id},
            {
                "$set": {
                    "total_time_minutes": new_total_time,
                    "total_xp": new_total_xp,
                    "streak": new_streak,
                    "last_logged_at": now,
                    "updated_at": now
                }
            }
        )
        
        # Update user total XP and rank
        await self.update_user_stats(user_id, xp_earned, time_log_data.minutes)
        
        return TimeLog(**time_log_doc, id=time_log_id)
    
    async def update_user_stats(self, user_id: str, xp_earned: int, minutes_logged: int):
        """Update user's total XP, time, and rank."""
        user = await self.db.users.find_one({"_id": user_id})
        if not user:
            return
        
        new_total_xp = user["total_xp"] + xp_earned
        new_total_time = user.get("total_time_minutes", 0) + minutes_logged
        new_rank = self.auth_service.get_rank_by_xp(new_total_xp)
        
        await self.db.users.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "total_xp": new_total_xp,
                    "total_time_minutes": new_total_time,
                    "current_rank": new_rank,
                    "last_active": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
    
    async def get_user_time_logs(
        self, 
        user_id: str, 
        skill_id: Optional[str] = None,
        limit: int = 50
    ) -> List[TimeLog]:
        """Get time logs for a user, optionally filtered by skill."""
        query = {"user_id": user_id}
        if skill_id:
            query["skill_id"] = skill_id
        
        cursor = self.db.time_logs.find(query).sort("logged_at", -1).limit(limit)
        time_logs = []
        async for log_doc in cursor:
            time_logs.append(TimeLog(**log_doc, id=log_doc["_id"]))
        return time_logs

class LeaderboardService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def get_leaderboard(self, user_id: str, limit: int = 50) -> LeaderboardResponse:
        """Get the global leaderboard."""
        # Get top users by XP
        cursor = self.db.users.find({}).sort("total_xp", -1).limit(limit)
        entries = []
        user_position = None
        
        rank_position = 1
        async for user_doc in cursor:
            entry = LeaderboardEntry(
                user_id=user_doc["_id"],
                username=user_doc["username"],
                avatar=user_doc["avatar"],
                total_xp=user_doc["total_xp"],
                current_rank=user_doc["current_rank"],
                rank_position=rank_position
            )
            entries.append(entry)
            
            if user_doc["_id"] == user_id:
                user_position = rank_position
            
            rank_position += 1
        
        # If user not in top entries, find their position
        if user_position is None:
            user_position = await self.db.users.count_documents({"total_xp": {"$gt": await self.get_user_xp(user_id)}}) + 1
        
        total_players = await self.db.users.count_documents({})
        
        return LeaderboardResponse(
            entries=entries,
            user_position=user_position,
            total_players=total_players
        )
    
    async def get_user_xp(self, user_id: str) -> int:
        """Get user's total XP."""
        user = await self.db.users.find_one({"_id": user_id}, {"total_xp": 1})
        return user["total_xp"] if user else 0

class AchievementService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def get_user_achievements(self, user_id: str) -> List[Dict]:
        """Get all achievements with user's progress."""
        # Get all achievements
        achievements_cursor = self.db.achievements.find({})
        all_achievements = []
        async for achievement in achievements_cursor:
            all_achievements.append(achievement)
        
        # Get user's earned achievements
        user_achievements_cursor = self.db.user_achievements.find({"user_id": user_id})
        earned_achievement_ids = set()
        earned_achievements_map = {}
        
        async for user_achievement in user_achievements_cursor:
            earned_achievement_ids.add(user_achievement["achievement_id"])
            earned_achievements_map[user_achievement["achievement_id"]] = user_achievement
        
        # Combine the data
        result = []
        for achievement in all_achievements:
            achievement_data = {
                "id": achievement["_id"],
                "name": achievement["name"],
                "description": achievement["description"],
                "icon": achievement["icon"],
                "xp_reward": achievement["xp_reward"],
                "type": achievement["achievement_type"],
                "earned": achievement["_id"] in earned_achievement_ids
            }
            
            if achievement["_id"] in earned_achievement_ids:
                user_achievement = earned_achievements_map[achievement["_id"]]
                achievement_data["earned_date"] = user_achievement["earned_at"].isoformat()
            
            result.append(achievement_data)
        
        return result
    
    async def check_and_award_achievements(self, user_id: str):
        """Check and award new achievements to user."""
        # This would contain logic to check various achievement criteria
        # and award new achievements. For now, it's a placeholder.
        pass

from fastapi import HTTPException