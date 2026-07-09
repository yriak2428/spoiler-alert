# import os
# from dotenv import load_dotenv
# from fastapi import APIRouter, UploadFile, File, HTTPException
# from google import genai
# from google.genai import types

# load_dotenv()

# router = APIRouter(
#     prefix="/gemini",
#     tags=["Gemini"]
# )

# @router.post("/product-name")
# async def get_product_name(file: UploadFile = File(...)):
#     image_bytes = await file.read()

#     if not image_bytes:
#         raise HTTPException(status_code=400, detail="No image uploaded")

#     api_key = os.getenv("GEMINI_API_KEY")

#     if not api_key:
#         raise HTTPException(
#             status_code=500,
#             detail="GEMINI_API_KEY is missing from backend .env"
#         )

#     try:
#         client = genai.Client(api_key=api_key)

#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=[
#                 types.Part.from_bytes(
#                     data=image_bytes,
#                     mime_type=file.content_type or "image/jpeg",
#                 ),
#                 """
#                 Identify the food or grocery product in this image.

#                 Return only the product name.
#                 Do not explain.
#                 Do not include punctuation.
#                 If you cannot identify the item, return Unknown product.

#                 Good examples:
#                 Milk
#                 Banana
#                 Greek yogurt
#                 Instant ramen
#                 Eggs
#                 """
#             ],
#         )

#         product_name = response.text.strip() if response.text else "Unknown product"

#         return {"product_name": product_name}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))