from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Optional

# Import our new modules
from database import connect_to_mongo, close_mongo_connection, get_database
from auth import AuthService, get_current_user
from services import SkillService, CategoryService, TimeLogService, LeaderboardService, AchievementService
from models import *

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="Galactic Quest API", version="1.0.0")

# Create API router
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    
    # Initialize default data
    from init_data import initialize_default_data
    db = await get_database()
    await initialize_default_data(db)
    
    logging.info("Connected to MongoDB and initialized default data")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()
    logging.info("Disconnected from MongoDB")

# Auth routes
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, db=Depends(get_database)):
    auth_service = AuthService(db)
    return await auth_service.register_user(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password,
        avatar=user_data.avatar
    )

@api_router.post("/auth/login", response_model=UserResponse)
async def login(user_data: UserLogin, db=Depends(get_database)):
    auth_service = AuthService(db)
    return await auth_service.authenticate_user(user_data.email, user_data.password)

@api_router.get("/auth/me", response_model=UserProfile)
async def get_current_user_profile(current_user=Depends(get_current_user)):
    return UserProfile(
        id=current_user["_id"],
        username=current_user["username"],
        email=current_user["email"],
        avatar=current_user["avatar"],
        total_xp=current_user["total_xp"],
        current_rank=current_user["current_rank"],
        joined_at=current_user["joined_at"],
        last_active=current_user["last_active"],
        total_time_minutes=current_user.get("total_time_minutes", 0)
    )

# Category routes
@api_router.get("/categories", response_model=List[Category])
async def get_categories(current_user=Depends(get_current_user), db=Depends(get_database)):
    category_service = CategoryService(db)
    return await category_service.get_user_categories(current_user["_id"])

@api_router.post("/categories", response_model=Category)
async def create_category(
    category_data: CategoryCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    category_service = CategoryService(db)
    return await category_service.create_category(current_user["_id"], category_data)

@api_router.delete("/categories/{category_id}", response_model=MessageResponse)
async def delete_category(
    category_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    category_service = CategoryService(db)
    success = await category_service.delete_category(current_user["_id"], category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return MessageResponse(message="Category deleted successfully")

# Skill routes
@api_router.get("/skills", response_model=List[Skill])
async def get_skills(current_user=Depends(get_current_user), db=Depends(get_database)):
    skill_service = SkillService(db)
    return await skill_service.get_user_skills(current_user["_id"])

@api_router.post("/skills", response_model=Skill)
async def create_skill(
    skill_data: SkillCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    skill_service = SkillService(db)
    return await skill_service.create_skill(current_user["_id"], skill_data)

@api_router.put("/skills/{skill_id}", response_model=Skill)
async def update_skill(
    skill_id: str,
    skill_data: SkillUpdate,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    skill_service = SkillService(db)
    updated_skill = await skill_service.update_skill(current_user["_id"], skill_id, skill_data)
    if not updated_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return updated_skill

@api_router.delete("/skills/{skill_id}", response_model=MessageResponse)
async def delete_skill(
    skill_id: str,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    skill_service = SkillService(db)
    success = await skill_service.delete_skill(current_user["_id"], skill_id)
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found")
    return MessageResponse(message="Skill deleted successfully")

# Time logging routes
@api_router.post("/time-logs", response_model=TimeLog)
async def log_time(
    time_log_data: TimeLogCreate,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    time_log_service = TimeLogService(db)
    return await time_log_service.log_time(current_user["_id"], time_log_data)

@api_router.get("/time-logs", response_model=List[TimeLog])
async def get_time_logs(
    skill_id: Optional[str] = None,
    limit: int = 50,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    time_log_service = TimeLogService(db)
    return await time_log_service.get_user_time_logs(current_user["_id"], skill_id, limit)

# Leaderboard routes
@api_router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    limit: int = 50,
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    leaderboard_service = LeaderboardService(db)
    return await leaderboard_service.get_leaderboard(current_user["_id"], limit)

# Achievement routes
@api_router.get("/achievements", response_model=List[Dict])
async def get_achievements(
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    achievement_service = AchievementService(db)
    return await achievement_service.get_user_achievements(current_user["_id"])

# Stats routes
@api_router.get("/stats/user", response_model=Dict)
async def get_user_stats(
    current_user=Depends(get_current_user),
    db=Depends(get_database)
):
    # Get user's skills and time logs for stats calculation
    skill_service = SkillService(db)
    time_log_service = TimeLogService(db)
    
    skills = await skill_service.get_user_skills(current_user["_id"])
    time_logs = await time_log_service.get_user_time_logs(current_user["_id"], limit=1000)
    
    # Calculate stats
    total_skills = len(skills)
    total_time = sum(skill.total_time_minutes for skill in skills)
    total_xp = sum(skill.total_xp for skill in skills)
    
    # Calculate current streak (simplified)
    current_streak = max([skill.streak for skill in skills], default=0)
    
    return {
        "total_skills": total_skills,
        "total_time_minutes": total_time,
        "total_xp": total_xp,
        "current_streak": current_streak,
        "total_logs": len(time_logs),
        "avg_xp_per_skill": total_xp / total_skills if total_skills > 0 else 0,
        "avg_time_per_skill": total_time / total_skills if total_skills > 0 else 0
    }

# Health check route
@api_router.get("/")
async def root():
    return {"message": "Galactic Quest API is running!", "timestamp": datetime.utcnow()}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include the router in the main app
app.include_router(api_router)

# Mount static files for React app
frontend_build_path = Path(__file__).parent.parent / "frontend" / "build"
if frontend_build_path.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_build_path / "static")), name="static")
    
    # Serve React app for all non-API routes
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        # For React Router, serve index.html for all non-static routes
        index_file = frontend_build_path / "index.html"
        if index_file.exists():
            return FileResponse(str(index_file))
        else:
            raise HTTPException(status_code=404, detail="Frontend not built")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

from typing import Dict
