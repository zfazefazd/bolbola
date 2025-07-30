from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import uuid
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify and decode JWT token."""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return user_id

async def get_current_user(
    user_id: str = Depends(verify_token),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current authenticated user."""
    user = await db.users.find_one({"_id": user_id})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Update last_active timestamp
    await db.users.update_one(
        {"_id": user_id},
        {"$set": {"last_active": datetime.utcnow()}}
    )
    
    return user

class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    async def register_user(self, username: str, email: str, password: str, avatar: str = "🌟"):
        """Register a new user."""
        # Check if user already exists
        existing_user = await self.db.users.find_one({
            "$or": [{"email": email}, {"username": username}]
        })
        
        if existing_user:
            if existing_user["email"] == email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
        
        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = get_password_hash(password)
        now = datetime.utcnow()
        
        # Calculate initial rank (Iron IV)
        initial_rank = self.get_rank_by_xp(0)
        
        user_doc = {
            "_id": user_id,
            "username": username,
            "email": email,
            "password_hash": hashed_password,
            "avatar": avatar,
            "total_xp": 0,
            "current_rank": initial_rank,
            "total_time_minutes": 0,
            "use_predefined_categories": True,  # Default to using predefined categories
            "notifications": True,
            "auto_save": True,
            "theme": "dark",
            "sound_effects": True,
            "daily_goal": 120,
            "streak_reminders": True,
            "joined_at": now,
            "last_active": now,
            "created_at": now,
            "updated_at": now
        }
        
        await self.db.users.insert_one(user_doc)
        
        # Initialize user's default data (predefined categories and initial quests)
        from init_data import initialize_user_default_data
        await initialize_user_default_data(self.db, user_id)
        
        # Create access token
        access_token = create_access_token(data={"sub": user_id})
        
        return {
            "id": user_id,
            "username": username,
            "email": email,
            "avatar": avatar,
            "total_xp": 0,
            "current_rank": initial_rank,
            "use_predefined_categories": True,
            "joined_at": now,
            "last_active": now,
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    async def authenticate_user(self, email: str, password: str):
        """Authenticate user login."""
        user = await self.db.users.find_one({"email": email})
        
        if not user or not verify_password(password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Update last_active
        await self.db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_active": datetime.utcnow()}}
        )
        
        # Create access token
        access_token = create_access_token(data={"sub": user["_id"]})
        
        return {
            "id": user["_id"],
            "username": user["username"],
            "email": user["email"],
            "avatar": user["avatar"],
            "total_xp": user["total_xp"],
            "current_rank": user["current_rank"],
            "use_predefined_categories": user.get("use_predefined_categories", True),
            "joined_at": user["joined_at"],
            "last_active": user["last_active"],
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    def get_rank_by_xp(self, total_xp: int) -> dict:
        """Calculate rank based on total XP."""
        rank_system = [
            # Iron
            {"tier": "Iron", "division": "IV", "total_rank": 1, "min_xp": 0, "max_xp": 999, "color": "#8B4513", "bg_color": "#2D1810"},
            {"tier": "Iron", "division": "III", "total_rank": 2, "min_xp": 1000, "max_xp": 1999, "color": "#8B4513", "bg_color": "#2D1810"},
            {"tier": "Iron", "division": "II", "total_rank": 3, "min_xp": 2000, "max_xp": 2999, "color": "#8B4513", "bg_color": "#2D1810"},
            {"tier": "Iron", "division": "I", "total_rank": 4, "min_xp": 3000, "max_xp": 3999, "color": "#8B4513", "bg_color": "#2D1810"},
            
            # Bronze
            {"tier": "Bronze", "division": "IV", "total_rank": 5, "min_xp": 4000, "max_xp": 5999, "color": "#CD7F32", "bg_color": "#3D2F1A"},
            {"tier": "Bronze", "division": "III", "total_rank": 6, "min_xp": 6000, "max_xp": 7999, "color": "#CD7F32", "bg_color": "#3D2F1A"},
            {"tier": "Bronze", "division": "II", "total_rank": 7, "min_xp": 8000, "max_xp": 9999, "color": "#CD7F32", "bg_color": "#3D2F1A"},
            {"tier": "Bronze", "division": "I", "total_rank": 8, "min_xp": 10000, "max_xp": 11999, "color": "#CD7F32", "bg_color": "#3D2F1A"},
            
            # Silver
            {"tier": "Silver", "division": "IV", "total_rank": 9, "min_xp": 12000, "max_xp": 14999, "color": "#C0C0C0", "bg_color": "#2A2A2A"},
            {"tier": "Silver", "division": "III", "total_rank": 10, "min_xp": 15000, "max_xp": 17999, "color": "#C0C0C0", "bg_color": "#2A2A2A"},
            {"tier": "Silver", "division": "II", "total_rank": 11, "min_xp": 18000, "max_xp": 20999, "color": "#C0C0C0", "bg_color": "#2A2A2A"},
            {"tier": "Silver", "division": "I", "total_rank": 12, "min_xp": 21000, "max_xp": 23999, "color": "#C0C0C0", "bg_color": "#2A2A2A"},
            
            # Gold
            {"tier": "Gold", "division": "IV", "total_rank": 13, "min_xp": 24000, "max_xp": 27999, "color": "#FFD700", "bg_color": "#3D3D1A"},
            {"tier": "Gold", "division": "III", "total_rank": 14, "min_xp": 28000, "max_xp": 31999, "color": "#FFD700", "bg_color": "#3D3D1A"},
            {"tier": "Gold", "division": "II", "total_rank": 15, "min_xp": 32000, "max_xp": 35999, "color": "#FFD700", "bg_color": "#3D3D1A"},
            {"tier": "Gold", "division": "I", "total_rank": 16, "min_xp": 36000, "max_xp": 39999, "color": "#FFD700", "bg_color": "#3D3D1A"},
            
            # Platinum
            {"tier": "Platinum", "division": "IV", "total_rank": 17, "min_xp": 40000, "max_xp": 44999, "color": "#00CED1", "bg_color": "#1A3D3D"},
            {"tier": "Platinum", "division": "III", "total_rank": 18, "min_xp": 45000, "max_xp": 49999, "color": "#00CED1", "bg_color": "#1A3D3D"},
            {"tier": "Platinum", "division": "II", "total_rank": 19, "min_xp": 50000, "max_xp": 54999, "color": "#00CED1", "bg_color": "#1A3D3D"},
            {"tier": "Platinum", "division": "I", "total_rank": 20, "min_xp": 55000, "max_xp": 59999, "color": "#00CED1", "bg_color": "#1A3D3D"},
            
            # Diamond
            {"tier": "Diamond", "division": "IV", "total_rank": 21, "min_xp": 60000, "max_xp": 69999, "color": "#1E90FF", "bg_color": "#1A1A3D"},
            {"tier": "Diamond", "division": "III", "total_rank": 22, "min_xp": 70000, "max_xp": 79999, "color": "#1E90FF", "bg_color": "#1A1A3D"},
            {"tier": "Diamond", "division": "II", "total_rank": 23, "min_xp": 80000, "max_xp": 89999, "color": "#1E90FF", "bg_color": "#1A1A3D"},
            {"tier": "Diamond", "division": "I", "total_rank": 24, "min_xp": 90000, "max_xp": 99999, "color": "#1E90FF", "bg_color": "#1A1A3D"},
            
            # Master
            {"tier": "Master", "division": "", "total_rank": 25, "min_xp": 100000, "max_xp": 149999, "color": "#9370DB", "bg_color": "#3D1A3D"},
            
            # Grandmaster
            {"tier": "Grandmaster", "division": "", "total_rank": 26, "min_xp": 150000, "max_xp": 199999, "color": "#FF1493", "bg_color": "#3D1A2A"},
            
            # Challenger
            {"tier": "Challenger", "division": "", "total_rank": 27, "min_xp": 200000, "max_xp": 999999999, "color": "#FF6347", "bg_color": "#3D2A1A"}
        ]
        
        for rank in reversed(rank_system):
            if total_xp >= rank["min_xp"]:
                return rank
        
        return rank_system[0]  # Default to Iron IV