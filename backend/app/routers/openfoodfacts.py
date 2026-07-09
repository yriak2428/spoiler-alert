# import requests
# from fastapi import APIRouter, HTTPException

# router = APIRouter(
#     prefix="/food",
#     tags=["Open Food Facts"]
# )

# @router.get("/product/{barcode}")
# def get_product_by_barcode(barcode: str):
#     url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"

#     headers = {
#         "User-Agent": "SpoilerAlert/1.0 (student project; contact: your-email@example.com)"
#     }

#     try:
#         response = requests.get(url, headers=headers, timeout=15)
#     except requests.RequestException as e:
#         raise HTTPException(
#             status_code=502,
#             detail=f"Could not connect to Open Food Facts: {str(e)}"
#         )

#     if response.status_code != 200:
#         raise HTTPException(
#             status_code=502,
#             detail=f"Open Food Facts request failed with status {response.status_code}: {response.text[:200]}"
#         )

#     data = response.json()

#     if data.get("status") != 1:
#         raise HTTPException(
#             status_code=404,
#             detail="Product not found in Open Food Facts"
#         )

#     product = data.get("product", {})

#     product_name = (
#         product.get("product_name")
#         or product.get("product_name_en")
#         or product.get("generic_name")
#         or "Unknown product"
#     )

#     return {
#         "barcode": barcode,
#         "product_name": product_name,
#         "brands": product.get("brands", ""),
#         "categories": product.get("categories", ""),
#         "image_url": product.get("image_url", ""),
#     }