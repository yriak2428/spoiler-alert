from fastapi import FastAPI, Response, status, HTTPException
from fastapi.params import Body
from pydantic import BaseModel
from typing import Optional
import datetime
from .routers import profiles, items, identifyProduct, gemini, openfoodfacts
from . import database

app = FastAPI()

app.include_router(items.router)
app.include_router(profiles.router)
app.include_router(identifyProduct.router)
# app.include_router(gemini.router)
# app.include_router(openfoodfacts.router)
 
@app.get("/")
async def hello():
    return {"message": "This is Spoiler Alert!"}