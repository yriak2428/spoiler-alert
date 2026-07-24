from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional
from supabase import Client
from ..database import get_supabase, verify_user_jwt

router = APIRouter(prefix="/profiles", tags=["Profiles"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    phone: Optional[str] = None
    dietary_restrictions: Optional[List[str]] = None
    cultural_preferences: Optional[List[str]] = None

# Get current user's profile and preferences
@router.get("/me")
async def get_my_profile(db: Client = Depends(get_supabase), token: str = Depends(oauth2_scheme)):
    db, claims = verify_user_jwt(db, token)
    user_id = claims["claims"]["sub"]
    
    response = db.table("profiles").select("*").eq("user_id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return response.data[0]

# Update current user's profile and preferences
@router.put("/me")
async def update_my_profile(
    profile_data: ProfileUpdate,
    db: Client = Depends(get_supabase), 
    token: str = Depends(oauth2_scheme)
):
    db, claims = verify_user_jwt(db, token)
    user_id = claims["claims"]["sub"]
    
    # Filter out None values so we only update fields that were provided
    update_dict = profile_data.model_dump(exclude_none=True)
    
    if not update_dict:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided for update")
        
    response = db.table("profiles").update(update_dict).eq("user_id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return response.data[0]





