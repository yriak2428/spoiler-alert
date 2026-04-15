import os
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi import Response, status, HTTPException

load_dotenv()


def get_supabase():
    url: str = os.getenv("LOCAL_SUPABASE_URL")
    key: str = os.getenv("LOCAL_SUPABASE_PUBKEY")
    supabase: Client = create_client(url, key)
    return supabase

def verify_user_jwt(db: Client, token: str):
    try:
        claims = db.auth.get_claims(token)
    except:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED, detail = f"Invalid User JWT")
    else:
        db.postgrest.auth(token)  
        return db, claims 
