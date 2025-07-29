from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None

db = Database()

async def get_database() -> AsyncIOMotorDatabase:
    return db.database

async def connect_to_mongo():
    """Create database connection"""
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'galactic_quest')
    
    db.client = AsyncIOMotorClient(mongo_url)
    db.database = db.client[db_name]
    
    # Create indexes for better performance
    await create_indexes()

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()

async def create_indexes():
    """Create database indexes for better performance"""
    if db.database is None:
        return
    
    # Users collection indexes
    await db.database.users.create_index("email", unique=True)
    await db.database.users.create_index("username", unique=True)
    await db.database.users.create_index("total_xp", background=True)
    
    # Skills collection indexes
    await db.database.skills.create_index([("user_id", 1), ("category_id", 1)])
    await db.database.skills.create_index("user_id")
    await db.database.skills.create_index("created_at")
    
    # Categories collection indexes
    await db.database.categories.create_index("user_id")
    
    # Time logs collection indexes
    await db.database.time_logs.create_index([("user_id", 1), ("logged_at", -1)])
    await db.database.time_logs.create_index("skill_id")
    await db.database.time_logs.create_index("logged_at")
    
    # User achievements collection indexes
    await db.database.user_achievements.create_index([("user_id", 1), ("achievement_id", 1)], unique=True)
    await db.database.user_achievements.create_index("user_id")
    
    # User quests collection indexes
    await db.database.user_quests.create_index([("user_id", 1), ("quest_id", 1)])
    await db.database.user_quests.create_index([("user_id", 1), ("end_date", 1)])
    
    print("Database indexes created successfully")