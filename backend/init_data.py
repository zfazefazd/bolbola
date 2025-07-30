"""
Default data initialization for Galactic Quest
"""
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import uuid

# Default achievements data
DEFAULT_ACHIEVEMENTS = [
    {
        "_id": "night-owl",
        "name": "Night Owl",
        "description": "Log activity between 2-5 AM",
        "icon": "🦉",
        "xp_reward": 100,
        "achievement_type": "time-based",
        "criteria": {"start_hour": 2, "end_hour": 5}
    },
    {
        "_id": "early-bird",
        "name": "Early Bird", 
        "description": "Log activity before 6 AM",
        "icon": "🐦",
        "xp_reward": 75,
        "achievement_type": "time-based",
        "criteria": {"before_hour": 6}
    },
    {
        "_id": "marathon-session",
        "name": "Marathon Master",
        "description": "Spend 5+ hours on one skill in a day",
        "icon": "🏃‍♂️",
        "xp_reward": 200,
        "achievement_type": "duration",
        "criteria": {"min_minutes": 300, "same_day": True}
    },
    {
        "_id": "category-explorer",
        "name": "Category Explorer",
        "description": "Try a new skill category for the first time",
        "icon": "🗺️",
        "xp_reward": 50,
        "achievement_type": "exploration",
        "criteria": {"new_category": True}
    },
    {
        "_id": "weekend-warrior",
        "name": "Weekend Warrior",
        "description": "Log activities on both Saturday and Sunday",
        "icon": "⚔️",
        "xp_reward": 150,
        "achievement_type": "consistency",
        "criteria": {"weekend_days": 2}
    },
    {
        "_id": "speed-demon",
        "name": "Speed Demon",
        "description": "Log 10 different activities in one day",
        "icon": "⚡",
        "xp_reward": 300,
        "achievement_type": "variety",
        "criteria": {"activities_per_day": 10}
    },
    {
        "_id": "perfectionist",
        "name": "Perfectionist",
        "description": "Complete 7 days without missing any planned activities",
        "icon": "💎",
        "xp_reward": 500,
        "achievement_type": "consistency",
        "criteria": {"consecutive_days": 7, "no_missed": True}
    },
    {
        "_id": "legendary-grinder",
        "name": "Legendary Grinder",
        "description": "Spend 100+ hours on Legendary difficulty activities",
        "icon": "🌟",
        "xp_reward": 1000,
        "achievement_type": "difficulty",
        "criteria": {"difficulty": "legendary", "min_hours": 100}
    },
    {
        "_id": "social-butterfly",
        "name": "Social Butterfly",
        "description": "Log 20+ hours of social activities in a week",
        "icon": "🦋",
        "xp_reward": 250,
        "achievement_type": "category",
        "criteria": {"category": "social", "min_hours": 20, "period": "week"}
    },
    {
        "_id": "mind-over-matter",
        "name": "Mind Over Matter",
        "description": "Balance 50+ hours each in Mind and Body categories",
        "icon": "🧠💪",
        "xp_reward": 400,
        "achievement_type": "balance",
        "criteria": {"categories": ["mind", "body"], "min_hours": 50}
    },
    {
        "_id": "creative-genius",
        "name": "Creative Genius",
        "description": "Reach 10,000 XP in Creativity category",
        "icon": "🎭",
        "xp_reward": 750,
        "achievement_type": "mastery",
        "criteria": {"category": "creativity", "min_xp": 10000}
    },
    {
        "_id": "productivity-guru",
        "name": "Productivity Guru",
        "description": "Maintain 30-day streak in Productivity",
        "icon": "📈",
        "xp_reward": 600,
        "achievement_type": "mastery",
        "criteria": {"category": "productivity", "streak_days": 30}
    },
    {
        "_id": "midnight-madness",
        "name": "Midnight Madness",
        "description": "Log activity exactly at midnight (12:00 AM)",
        "icon": "🌙",
        "xp_reward": 150,
        "achievement_type": "time-based",
        "criteria": {"exact_hour": 0}
    },
    {
        "_id": "holiday-hero",
        "name": "Holiday Hero",
        "description": "Log activities on 3 major holidays",
        "icon": "🎉",
        "xp_reward": 300,
        "achievement_type": "special",
        "criteria": {"holiday_count": 3}
    },
    {
        "_id": "triple-threat",
        "name": "Triple Threat",
        "description": "Reach level 10 in 3 different categories",
        "icon": "🎯",
        "xp_reward": 800,
        "achievement_type": "achievement",
        "criteria": {"categories": 3, "min_level": 10}
    },
    {
        "_id": "time-lord",
        "name": "Time Lord",
        "description": "Log activities for 365 consecutive days",
        "icon": "⏰",
        "xp_reward": 2000,
        "achievement_type": "legendary",
        "criteria": {"consecutive_days": 365}
    },
    {
        "_id": "variety-seeker",
        "name": "Variety Seeker",
        "description": "Try all 6 difficulty levels in one week",
        "icon": "🎲",
        "xp_reward": 200,
        "achievement_type": "variety",
        "criteria": {"difficulty_levels": 6, "period": "week"}
    },
    {
        "_id": "comeback-kid",
        "name": "Comeback Kid",
        "description": "Return after a 7+ day break and log activity",
        "icon": "🔄",
        "xp_reward": 100,
        "achievement_type": "resilience",
        "criteria": {"break_days": 7, "return": True}
    },
    {
        "_id": "zen-master",
        "name": "Zen Master",
        "description": "Log meditation activity for 100+ hours total",
        "icon": "☯️",
        "xp_reward": 500,
        "achievement_type": "mastery",
        "criteria": {"skill_type": "meditation", "min_hours": 100}
    },
    {
        "_id": "ultimate-champion",
        "name": "Ultimate Champion",
        "description": "Reach Challenger rank",
        "icon": "🏆",
        "xp_reward": 5000,
        "achievement_type": "legendary",
        "criteria": {"min_rank": "challenger"}
    }
]

# Default predefined categories (will be created as system categories)
DEFAULT_PREDEFINED_CATEGORIES = [
    {
        "_id": "predefined-mind",
        "name": "Mind",
        "icon": "🧠",
        "color": "#00BFA6",
        "description": "Mental development and learning",
        "is_predefined": True
    },
    {
        "_id": "predefined-body",
        "name": "Body",
        "icon": "💪",
        "color": "#2962FF",
        "description": "Physical fitness and health",
        "is_predefined": True
    },
    {
        "_id": "predefined-creativity",
        "name": "Creativity",
        "icon": "🎨",
        "color": "#BB86FC",
        "description": "Creative expression and arts",
        "is_predefined": True
    },
    {
        "_id": "predefined-productivity",
        "name": "Productivity",
        "icon": "⚡",
        "color": "#FFD54F",
        "description": "Work efficiency and organization",
        "is_predefined": True
    },
    {
        "_id": "predefined-social",
        "name": "Social",
        "icon": "🤝",
        "color": "#FF6B6B",
        "description": "Relationships and communication",
        "is_predefined": True
    },
    {
        "_id": "predefined-spiritual",
        "name": "Spiritual",
        "icon": "🕯️",
        "color": "#9C27B0",
        "description": "Inner peace and mindfulness",
        "is_predefined": True
    }
]

# Default quest templates
DEFAULT_QUEST_TEMPLATES = [
    {
        "_id": "daily-grind",
        "name": "Daily Grind",
        "description": "Log time in 3 different skills today",
        "quest_type": "daily",
        "target_value": 3,
        "xp_reward": 75,
        "criteria": {"skill_count": 3, "period": "day"}
    },
    {
        "_id": "time-investor",
        "name": "Time Investor", 
        "description": "Spend 2+ hours on any activity today",
        "quest_type": "daily",
        "target_value": 120,
        "xp_reward": 100,
        "criteria": {"min_minutes": 120, "period": "day"}
    },
    {
        "_id": "consistency-master",
        "name": "Consistency Master",
        "description": "Log activity every day this week",
        "quest_type": "weekly",
        "target_value": 7,
        "xp_reward": 300,
        "criteria": {"consecutive_days": 7, "period": "week"}
    }
]

async def initialize_default_data(db: AsyncIOMotorDatabase):
    """Initialize default achievements, predefined categories, and quest templates."""
    
    # Initialize achievements
    existing_achievements = await db.achievements.count_documents({})
    if existing_achievements == 0:
        await db.achievements.insert_many(DEFAULT_ACHIEVEMENTS)
        print(f"Inserted {len(DEFAULT_ACHIEVEMENTS)} default achievements")
    
    # Initialize predefined categories (system-wide)
    existing_predefined = await db.predefined_categories.count_documents({})
    if existing_predefined == 0:
        predefined_with_timestamps = []
        for category in DEFAULT_PREDEFINED_CATEGORIES:
            cat_doc = category.copy()
            cat_doc["created_at"] = datetime.utcnow()
            predefined_with_timestamps.append(cat_doc)
        
        await db.predefined_categories.insert_many(predefined_with_timestamps)
        print(f"Inserted {len(DEFAULT_PREDEFINED_CATEGORIES)} predefined categories")
    
    # Initialize quest templates
    existing_quests = await db.quest_templates.count_documents({})
    if existing_quests == 0:
        quest_templates_with_timestamps = []
        for quest in DEFAULT_QUEST_TEMPLATES:
            quest_doc = quest.copy()
            quest_doc["created_at"] = datetime.utcnow()
            quest_templates_with_timestamps.append(quest_doc)
        
        await db.quest_templates.insert_many(quest_templates_with_timestamps)
        print(f"Inserted {len(DEFAULT_QUEST_TEMPLATES)} quest templates")
    
    print("Default data initialization completed")

async def initialize_user_default_data(db: AsyncIOMotorDatabase, user_id: str):
    """Initialize default user-specific data when a new user registers."""
    
    # Create user's predefined categories from templates
    existing_user_categories = await db.categories.count_documents({"user_id": user_id})
    if existing_user_categories == 0:
        user_categories = []
        for predefined in DEFAULT_PREDEFINED_CATEGORIES:
            user_cat = {
                "_id": str(uuid.uuid4()),
                "name": predefined["name"],
                "icon": predefined["icon"],
                "color": predefined["color"],
                "description": predefined["description"],
                "user_id": user_id,
                "is_predefined": True,
                "created_at": datetime.utcnow()
            }
            user_categories.append(user_cat)
        
        await db.categories.insert_many(user_categories)
        print(f"Created {len(user_categories)} predefined categories for user {user_id}")
    
    # Initialize user's daily and weekly quests
    today = datetime.utcnow().date()
    existing_user_quests = await db.user_quests.count_documents({
        "user_id": user_id,
        "start_date": {"$gte": datetime.combine(today, datetime.min.time())}
    })
    
    if existing_user_quests == 0:
        user_quests = []
        
        # Create daily quests
        for template in DEFAULT_QUEST_TEMPLATES:
            if template["quest_type"] == "daily":
                user_quest = {
                    "_id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "quest_id": template["_id"],
                    "name": template["name"],
                    "description": template["description"],
                    "quest_type": template["quest_type"],
                    "target_value": template["target_value"],
                    "xp_reward": template["xp_reward"],
                    "progress": 0,
                    "completed": False,
                    "claimed": False,
                    "start_date": datetime.combine(today, datetime.min.time()),
                    "end_date": datetime.combine(today, datetime.max.time()),
                    "created_at": datetime.utcnow()
                }
                user_quests.append(user_quest)
            
            elif template["quest_type"] == "weekly":
                # Calculate week start (Monday) and end (Sunday)
                from datetime import timedelta
                weekday = today.weekday()
                week_start = today - timedelta(days=weekday)
                week_end = week_start + timedelta(days=6)
                
                user_quest = {
                    "_id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "quest_id": template["_id"],
                    "name": template["name"],
                    "description": template["description"],
                    "quest_type": template["quest_type"],
                    "target_value": template["target_value"],
                    "xp_reward": template["xp_reward"],
                    "progress": 0,
                    "completed": False,
                    "claimed": False,
                    "start_date": datetime.combine(week_start, datetime.min.time()),
                    "end_date": datetime.combine(week_end, datetime.max.time()),
                    "created_at": datetime.utcnow()
                }
                user_quests.append(user_quest)
        
        if user_quests:
            await db.user_quests.insert_many(user_quests)
            print(f"Created {len(user_quests)} quests for user {user_id}")