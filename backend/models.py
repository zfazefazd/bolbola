from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
from datetime import datetime
import uuid
from enum import Enum

# Enums
class DifficultyLevel(str, Enum):
    TRIVIAL = "trivial"
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    EXTREME = "extreme"
    LEGENDARY = "legendary"

class RankTier(str, Enum):
    IRON = "Iron"
    BRONZE = "Bronze"
    SILVER = "Silver"
    GOLD = "Gold"
    PLATINUM = "Platinum"
    DIAMOND = "Diamond"
    MASTER = "Master"
    GRANDMASTER = "Grandmaster"
    CHALLENGER = "Challenger"

class AchievementType(str, Enum):
    TIME_BASED = "time-based"
    DURATION = "duration"
    EXPLORATION = "exploration"
    CONSISTENCY = "consistency"
    VARIETY = "variety"
    DIFFICULTY = "difficulty"
    CATEGORY = "category"
    BALANCE = "balance"
    MASTERY = "mastery"
    SPECIAL = "special"
    RESILIENCE = "resilience"
    LEGENDARY = "legendary"
    ACHIEVEMENT = "achievement"

# User Models
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=6)
    avatar: str = "🌟"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: str
    username: str
    email: EmailStr
    avatar: str
    total_xp: int = 0
    current_rank: Dict
    joined_at: datetime
    last_active: datetime
    total_time_minutes: int = 0
    use_predefined_categories: bool = True

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    avatar: str
    total_xp: int
    current_rank: Dict
    joined_at: datetime
    last_active: datetime
    access_token: str
    token_type: str = "bearer"
    use_predefined_categories: bool = True

class UserSettings(BaseModel):
    use_predefined_categories: bool = True
    notifications: bool = True
    auto_save: bool = True
    theme: str = "dark"
    sound_effects: bool = True
    daily_goal: int = 120
    streak_reminders: bool = True

class UserSettingsUpdate(BaseModel):
    use_predefined_categories: Optional[bool] = None
    notifications: Optional[bool] = None
    auto_save: Optional[bool] = None
    theme: Optional[str] = None
    sound_effects: Optional[bool] = None
    daily_goal: Optional[int] = None
    streak_reminders: Optional[bool] = None

# Category Models
class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    icon: str = "📂"
    color: str = "#00BFA6"
    description: str = ""

class Category(BaseModel):
    id: str
    name: str
    icon: str
    color: str
    description: str
    user_id: str
    is_predefined: bool = False
    created_at: datetime

class PredefinedCategory(BaseModel):
    id: str
    name: str
    icon: str
    color: str
    description: str
    is_predefined: bool = True
    created_at: datetime

# Skill Models
class SkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category_id: str
    difficulty: DifficultyLevel
    icon: str = "🎯"
    description: str = ""

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    icon: Optional[str] = None
    description: Optional[str] = None

class Skill(BaseModel):
    id: str
    name: str
    category_id: str
    difficulty: DifficultyLevel
    icon: str
    description: str
    total_time_minutes: int = 0
    total_xp: int = 0
    streak: int = 0
    last_logged_at: Optional[datetime] = None
    user_id: str
    created_at: datetime
    updated_at: datetime

# Time Log Models
class TimeLogCreate(BaseModel):
    skill_id: str
    minutes: int = Field(..., gt=0, le=1440)  # Max 24 hours per log
    note: Optional[str] = None

class TimeLog(BaseModel):
    id: str
    skill_id: str
    minutes: int
    xp_earned: int
    note: Optional[str] = None
    user_id: str
    logged_at: datetime

# Achievement Models
class Achievement(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    xp_reward: int
    achievement_type: AchievementType
    criteria: Dict  # Flexible criteria storage

class UserAchievement(BaseModel):
    id: str
    user_id: str
    achievement_id: str
    earned_at: datetime
    xp_awarded: int

# Quest Models
class Quest(BaseModel):
    id: str
    name: str
    description: str
    quest_type: str  # "daily", "weekly"
    target_value: int
    xp_reward: int
    criteria: Dict
    is_active: bool = True

class UserQuest(BaseModel):
    id: str
    user_id: str
    quest_id: str
    name: str
    description: str
    quest_type: str
    target_value: int
    xp_reward: int
    progress: int = 0
    completed: bool = False
    claimed: bool = False
    start_date: datetime
    end_date: datetime

class QuestProgress(BaseModel):
    quest_id: str
    progress: int
    completed: bool
    claimed: bool

# Leaderboard Models
class LeaderboardEntry(BaseModel):
    user_id: str
    username: str
    avatar: str
    total_xp: int
    current_rank: Dict
    rank_position: int

class LeaderboardResponse(BaseModel):
    entries: List[LeaderboardEntry]
    user_position: Optional[int] = None
    total_players: int

# Stats Models
class UserStats(BaseModel):
    user_id: str
    total_skills: int
    total_categories: int
    total_time_minutes: int
    total_xp: int
    achievements_earned: int
    current_streak: int
    longest_streak: int
    avg_daily_time: float
    most_active_category: Optional[str] = None
    rank_progression: List[Dict]

class CategoryStats(BaseModel):
    category_id: str
    category_name: str
    total_time_minutes: int
    total_xp: int
    skills_count: int
    completion_percentage: float

# Response Models
class MessageResponse(BaseModel):
    message: str
    success: bool = True

class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    size: int
    pages: int