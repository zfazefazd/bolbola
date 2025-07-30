from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
import os
import logging
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None

db = Database()

async def get_database() -> AsyncIOMotorDatabase:
    return db.database

async def connect_to_mongo():
    """Create database connection with proper SSL configuration"""
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'galactic_quest')
    
    if not mongo_url:
        raise ValueError("MONGO_URL environment variable is required")
    
    # Configure MongoDB client with correct options for current PyMongo version
    client_options = {
        'serverSelectionTimeoutMS': 10000,  # 10 seconds timeout
        'connectTimeoutMS': 10000,
        'socketTimeoutMS': 10000,
        'maxPoolSize': 10,
        'retryWrites': True
    }
    
    # For Atlas connections, use correct SSL options
    if 'mongodb+srv://' in mongo_url or 'mongodb.net' in mongo_url:
        client_options.update({
            'tls': True,  # Use 'tls' instead of 'ssl'
            'tlsInsecure': True  # Allow invalid certificates
        })
    
    try:
        logging.info(f"Connecting to MongoDB at: {mongo_url[:20]}...")
        db.client = AsyncIOMotorClient(mongo_url, **client_options)
        
        # Test the connection
        await db.client.admin.command('ping')
        logging.info("MongoDB connection successful!")
        
        db.database = db.client[db_name]
        
        # Create indexes for better performance (with error handling)
        await create_indexes_safe()
        
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        logging.info("MongoDB connection closed")

async def create_indexes_safe():
    """Create database indexes with error handling"""
    if db.database is None:
        return
    
    try:
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
        
        logging.info("Database indexes created successfully")
        
    except Exception as e:
        logging.warning(f"Some indexes may already exist or failed to create: {e}")
        # Don't fail the app if indexes can't be created

async def create_indexes():
    """Legacy function for compatibility"""
    await create_indexes_safe()