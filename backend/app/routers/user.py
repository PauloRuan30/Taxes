# user_router.py

from fastapi import APIRouter, HTTPException
from bson import ObjectId
from typing import List
from pydantic import BaseModel

from mongodb import db
from services.auth_utils import hash_password

# ---------------------------------------------------
# Pydantic models (simplified for demonstration).
# Adjust them as you see fit for your domain logic.
# ---------------------------------------------------
class UserBase(BaseModel):
    username: str
    email: str | None = None

class UserCreate(UserBase):
    password: str

class UserPublic(UserBase):
    id: str

user_router = APIRouter(prefix="/users", tags=["Users"])

users_collection = db.get_collection("users")

# ---------------------------------------------------
#  GET /users - List all users
# ---------------------------------------------------
@user_router.get("/", response_model=List[UserPublic])
async def list_users():
    all_users = []
    async for doc in users_collection.find():
        all_users.append(
            UserPublic(
                id=str(doc["_id"]),
                username=doc["username"],
                email=doc.get("email", "")
            )
        )
    return all_users

# ---------------------------------------------------
#  POST /users - Create a new user
# ---------------------------------------------------
@user_router.post("/", response_model=UserPublic)
async def create_user(new_user: UserCreate):
    # 1) Check if username is taken
    existing = await users_collection.find_one({"username": new_user.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username is already in use")

    # 2) Hash the password
    hashed_pw = hash_password(new_user.password)

    # 3) Insert into the DB
    doc = {
        "username": new_user.username,
        "email": new_user.email,
        "hashed_password": hashed_pw,
        "is_active": True,
        "is_superuser": False,
        "is_verified": False
    }
    result = await users_collection.insert_one(doc)
    created = await users_collection.find_one({"_id": result.inserted_id})

    return UserPublic(
        id=str(created["_id"]),
        username=created["username"],
        email=created.get("email", "")
    )

# ---------------------------------------------------
#  PUT /users/{user_id} - Update an existing user
# ---------------------------------------------------
@user_router.put("/{user_id}", response_model=UserPublic)
async def update_user(user_id: str, user_data: UserCreate):
    """
    For simplicity, we re-use the 'UserCreate' model here,
    which includes `username`, `email`, and `password`.
    If the user passes a new password, we’ll update the hash.
    Otherwise, you can either:
       - treat empty password as "don't update"
       - or make a separate model for updates
    """
    try:
        oid = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user id format")

    # Build an update dict
    update_fields = {
        "username": user_data.username,
        "email": user_data.email
    }
    if user_data.password:
        update_fields["hashed_password"] = hash_password(user_data.password)

    # Perform the update
    result = await users_collection.update_one(
        {"_id": oid},
        {"$set": update_fields}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # Return the updated doc
    updated_user = await users_collection.find_one({"_id": oid})
    return UserPublic(
        id=str(updated_user["_id"]),
        username=updated_user["username"],
        email=updated_user.get("email", "")
    )

# ---------------------------------------------------
#  DELETE /users/{user_id} - Delete user
# ---------------------------------------------------
@user_router.delete("/{user_id}")
async def delete_user(user_id: str):
    try:
        oid = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user id format")

    result = await users_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}
