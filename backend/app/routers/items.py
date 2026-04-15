from fastapi import FastAPI, Response, status, HTTPException, APIRouter, Depends
from fastapi.params import Body
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from supabase import Client
from pydantic import BaseModel
from ..database import get_supabase, verify_user_jwt
import datetime

router = APIRouter(prefix = "/items")


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Items(BaseModel):
    id: Optional[str] = None
    item_name: str
    quantity: int
    weight: Optional[str] = None
    description: Optional[str] = None
    expiry_date: Optional[datetime.date] = None
    production_date: Optional[datetime.date] = None
    purchase_date: Optional[datetime.date] = None
    reminder_at: Optional[datetime.datetime] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime.datetime] = None
    last_updated: Optional[datetime.datetime] = None
    category: str = "Uncategorized"
    storage_location: Optional[str] = None
    item_status: Optional[str] = None
        
#get all items for a user
@router.get("/")
async def get_items(db: Client = Depends(get_supabase), token: str = Depends(oauth2_scheme)):
    db, claims = verify_user_jwt(db, token)
    response = db.table("items").select("*").eq("user_id", claims["claims"]["sub"]).execute()
    return response

#get item with id = id of user
@router.get("/{id}")
async def get_item( id: str, db: Client = Depends(get_supabase), token: str = Depends(oauth2_scheme)):
    db, claims = verify_user_jwt(db, token)
    response = db.table("items").select().eq("id", id).execute()
    if (not response):
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = f"post with id: {id} was not found")
    else:
        return response

#insert new item for a user
@router.post("/", status_code = status.HTTP_201_CREATED)
async def add_item(item: Items, db: Client = Depends(get_supabase), token: str = Depends(oauth2_scheme)):
    item_dict = item.model_dump(mode="json", exclude_none = True)
    db, claims = verify_user_jwt(db, token)
    item_dict["user_id"] = claims["claims"]["sub"]
    response = db.table("items").insert(item_dict).execute()
    return response

#edit item entry details
@router.put("/{id}")
async def edit_item(id: str, item: Items, db: Client = Depends(get_supabase), token: str = Depends(oauth2_scheme)):
    db, claims = verify_user_jwt(db, token)
    item_dict = item.model_dump(mode="json")
    response = db.table("items").update(item_dict).eq("id", id).execute()
    if (not response):
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = f"post with id: {id} was not found")
    else:
        return response

#delete item for a user
@router.delete("/{id}")
async def delete_item(id: str, db: Client = Depends(get_supabase), token: str = Depends(oauth2_scheme)):
   db, claims = verify_user_jwt(db, token)
   response = db.table("items").delete().eq("id", id).execute()
   if (not response):
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail = f"post with id: {id} was not found")   
   else:
       return Response(status_code = status.HTTP_204_NO_CONTENT)