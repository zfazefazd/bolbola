"""
Default data initialization for Galactic Quest
"""
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

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

# Default categories
DEFAULT_CATEGORIES = [
    {
        "name": "Mind",
        "icon": "🧠",
        "color": "#00BFA6",
        "description": "Mental development and learning"
    },
    {
        "name": "Body",
        "icon": "💪",
        "color": "#2962FF",
        "description": "Physical fitness and health"
    },
    {
        "name": "Creativity",
        "icon": "🎨",
        "color": "#BB86FC",
        "description": "Creative expression and arts"
    },
    {
        "name": "Productivity",
        "icon": "⚡",
        "color": "#FFD54F",
        "description": "Work efficiency and organization"
    },
    {
        "name": "Social",
        "icon": "🤝",
        "color": "#FF6B6B",
        "description": "Relationships and communication"
    },
    {
        "name": "Spiritual",
        "icon": "🕯️",
        "color": "#9C27B0",
        "description": "Inner peace and mindfulness"
    }
]

async def initialize_default_data(db: AsyncIOMotorDatabase):
    """Initialize default achievements and other data."""
    
    # Initialize achievements
    existing_achievements = await db.achievements.count_documents({})
    if existing_achievements == 0:
        await db.achievements.insert_many(DEFAULT_ACHIEVEMENTS)
        print(f"Inserted {len(DEFAULT_ACHIEVEMENTS)} default achievements")
    
    print("Default data initialization completed")