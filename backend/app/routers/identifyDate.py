import os
from dotenv import load_dotenv
from fastapi import APIRouter, UploadFile, File, HTTPException
from google import genai
from google.genai import types

load_dotenv()

router = APIRouter(
    prefix="/gemini",
    tags=["Gemini"]
)

@router.post("/product-expiration-date")
async def get_expiration_date(file: UploadFile = File(...)):
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="No image uploaded")

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is missing from backend .env"
        )

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=file.content_type or "image/jpeg",
                ),
                """
                Look at this produt or produce image and find the expiration date.
                Return only one of the following:
                - The expiration date in YYYY/MM/DD format
                - Unknown expiration date

                Do not include explanations, labels, markdown, or extra text.
                """
            ],
        )

        expiry_date = response.text.strip() if response.text else "Unknown expiration date"

        return {"expiry_date": expiry_date}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))