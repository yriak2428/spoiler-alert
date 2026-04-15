from fastapi import FastAPI, Response, status, HTTPException, APIRouter
from fastapi.params import Body
from pydantic import BaseModel

router = APIRouter(prefix = "/profiles")





