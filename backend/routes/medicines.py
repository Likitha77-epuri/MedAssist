from fastapi import APIRouter, HTTPException
from database import get_collection
from models import MedicineResponse
from typing import List, Optional
from bson import ObjectId

router = APIRouter(prefix="", tags=["Medicines Database"])

def format_medicine(m: dict) -> dict:
    return {
        "id": str(m["_id"]),
        "name": m["name"],
        "uses": m.get("uses", []),
        "dosage": m.get("dosage", ""),
        "side_effects": m.get("side_effects", []),
        "precautions": m.get("precautions", []),
        "interactions": m.get("interactions", []),
        "storage": m.get("storage", "")
    }

@router.get("/medicines", response_model=List[dict])
async def get_all_medicines(query: Optional[str] = None):
    medicines_col = get_collection("medicines")
    
    filter_q = {}
    if query:
        regex_dict = {"$regex": query, "$options": "i"}
        filter_q = {
            "$or": [
                {"name": regex_dict},
                {"uses": regex_dict}
            ]
        }
        
    cursor = medicines_col.find(filter_q)
    results = []
    async for m in cursor:
        results.append(format_medicine(m))
    return results

@router.get("/medicine/{medicine_id}", response_model=MedicineResponse)
async def get_medicine(medicine_id: str):
    medicines_col = get_collection("medicines")
    try:
        m = await medicines_col.find_one({"_id": ObjectId(medicine_id)})
    except Exception:
        # Fallback to search by name if not an ObjectId
        m = await medicines_col.find_one({"name": {"$regex": f"^{medicine_id}$", "$options": "i"}})
        
    if not m:
        raise HTTPException(status_code=404, detail="Medicine not found")
        
    return format_medicine(m)
