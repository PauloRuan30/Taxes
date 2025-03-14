# auth.py

from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi import status
from typing import Optional
from datetime import timedelta
from bson import ObjectId

from models.models import UserCreate, UserInDB, UserLogin, UserPublic, ForgotPasswordRequest, ResetPasswordRequest
from mongodb import db  # The same "db" from your mongodb.py
from services.auth_utils import hash_password, verify_password, create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

users_collection = db.get_collection("users")

#
# UTIL: Convert MongoDB user doc -> Public schema
#
def user_to_public(user_doc) -> UserPublic:
    return UserPublic(
        id=str(user_doc["_id"]),
        username=user_doc["username"]
    )

#
# ROUTE: Register new user
#
@auth_router.post("/register", response_model=UserPublic)
async def register_user(user_data: UserCreate):
    # 1) Check if passwords match
    if user_data.password != user_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    # 2) Check if user already exists
    existing = await users_collection.find_one({"username": user_data.username})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # 3) Hash the password & store in DB
    hashed = hash_password(user_data.password)
    
    # Store email if username looks like an email
    email = user_data.username if '@' in user_data.username else None
    
    new_user_doc = {
        "username": user_data.username,
        "hashed_password": hashed,
        "email": email,
        "is_active": True,
        "is_superuser": False,
        "is_verified": False
    }
    
    result = await users_collection.insert_one(new_user_doc)
    created_user = await users_collection.find_one({"_id": result.inserted_id})

    return user_to_public(created_user)

#
# ROUTE: Login (generate JWT token)
#
@auth_router.post("/login")
async def login_user(login_data: UserLogin):
    # 1) Find user by username
    user_doc = await users_collection.find_one({"username": login_data.username})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # 2) Verify password
    if not verify_password(login_data.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # 3) Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_doc["username"]},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

#
# ROUTE: Forgot password (fake email link)
#
@auth_router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    """
    This route simulates sending an email with a reset token. 
    In a real app, you would integrate an email provider.
    """
    user_doc = await users_collection.find_one({"username": req.email})
    if not user_doc:
        # We do not reveal if user exists or not in real scenario
        return {"message": "If that email is registered, a reset token has been sent."}

    # Create a short-lived token for resetting password
    reset_token = create_access_token(
        data={"sub": user_doc["username"]},
        expires_delta=timedelta(minutes=15)  # token good for 15 min
    )

    # In a real system, store the token, or send via email link
    # For demo, just return the token or log it
    # You might also store it in the DB if you want to verify later
    # but for demonstration, let's just pretend we emailed it:
    print(f"Password reset token for {user_doc['username']}: {reset_token}")

    return {"message": "Reset token generated. Check logs for the token."}

#
# ROUTE: Reset password
#
@auth_router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    """
    Expects a token from the forgot-password step and a new password.
    """
    try:
        decoded = decode_access_token(req.token)
        username = decoded.get("sub", None)
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")

        # 2) Find the user in DB
        user_doc = await users_collection.find_one({"username": username})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")

        # 3) Update user's password
        new_hashed = hash_password(req.new_password)
        await users_collection.update_one(
            {"_id": user_doc["_id"]},
            {"$set": {"hashed_password": new_hashed}}
        )

        return {"message": "Password updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
