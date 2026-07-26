from fastapi import APIRouter, Depends, HTTPException, status
from database import get_collection
from models import UserRegister, UserLogin, ForgotPasswordRequest, UserProfileUpdate, UserResponse
from auth import hash_password, verify_password, create_access_token, get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="", tags=["Authentication"])

def format_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name", ""),
        "role": user.get("role", "user"),
        "age": user.get("age"),
        "gender": user.get("gender"),
        "blood_group": user.get("blood_group"),
        "allergies": user.get("allergies", []),
        "chronic_diseases": user.get("chronic_diseases", []),
        "emergency_contact": user.get("emergency_contact"),
        "created_at": user.get("created_at", datetime.utcnow())
    }

@router.post("/register", response_model=dict)
async def register(user_data: UserRegister):
    users_col = get_collection("users")
    existing_user = await users_col.find_one({"email": user_data.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if this is the first user; if so, make them an admin
    user_count = await users_col.count_documents({})
    assigned_role = "admin" if user_count == 0 else user_data.role
    
    hashed_pwd = hash_password(user_data.password)
    
    new_user = {
        "email": user_data.email.lower(),
        "password": hashed_pwd,
        "full_name": user_data.full_name,
        "role": assigned_role,
        "age": None,
        "gender": None,
        "blood_group": None,
        "allergies": [],
        "chronic_diseases": [],
        "emergency_contact": None,
        "created_at": datetime.utcnow()
    }
    
    result = await users_col.insert_one(new_user)
    token = create_access_token(data={"sub": str(result.inserted_id), "role": assigned_role})
    
    return {
        "token": token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
            "email": new_user["email"],
            "full_name": new_user["full_name"],
            "role": new_user["role"]
        }
    }

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    users_col = get_collection("users")
    user = await users_col.find_one({"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    token = create_access_token(data={"sub": str(user["_id"]), "role": user.get("role", "user")})
    return {
        "token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user.get("full_name", ""),
            "role": user.get("role", "user")
        }
    }

@router.post("/forgot-password", response_model=dict)
async def forgot_password(data: ForgotPasswordRequest):
    users_col = get_collection("users")
    user = await users_col.find_one({"email": data.email.lower()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email address not found"
        )
    
    hashed_pwd = hash_password(data.new_password)
    await users_col.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hashed_pwd}}
    )
    return {"message": "Password updated successfully"}

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return format_user(current_user)

@router.put("/profile", response_model=UserResponse)
async def update_profile(profile_data: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    users_col = get_collection("users")
    
    update_fields = {}
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        update_fields[field] = value
        
    if update_fields:
        await users_col.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_fields}
        )
        updated_user = await users_col.find_one({"_id": ObjectId(current_user["id"])})
        return format_user(updated_user)
        
    return format_user(current_user)
