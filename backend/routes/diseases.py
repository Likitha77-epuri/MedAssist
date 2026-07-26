from fastapi import APIRouter, HTTPException
from database import get_collection
from models import DiseaseResponse
from typing import List, Optional
from bson import ObjectId

router = APIRouter(prefix="", tags=["Diseases Database"])

def format_disease(d: dict) -> dict:
    return {
        "id": str(d["_id"]),
        "name": d["name"],
        "description": d["description"],
        "causes": d.get("causes", []),
        "symptoms": d.get("symptoms", []),
        "risk_factors": d.get("risk_factors", []),
        "prevention": d.get("prevention", []),
        "treatment": d.get("treatment", []),
        "lifestyle_tips": d.get("lifestyle_tips", [])
    }

@router.get("/diseases", response_model=List[dict])
async def get_all_diseases(query: Optional[str] = None):
    diseases_col = get_collection("diseases")
    
    filter_q = {}
    if query:
        # Simple regex search on name, description or symptoms
        regex_dict = {"$regex": query, "$options": "i"}
        filter_q = {
            "$or": [
                {"name": regex_dict},
                {"description": regex_dict},
                {"symptoms": regex_dict}
            ]
        }
        
    cursor = diseases_col.find(filter_q)
    results = []
    async for d in cursor:
        results.append(format_disease(d))
    return results

@router.get("/disease/{disease_id}", response_model=DiseaseResponse)
async def get_disease(disease_id: str):
    diseases_col = get_collection("diseases")
    try:
        d = await diseases_col.find_one({"_id": ObjectId(disease_id)})
    except Exception:
        # Fallback to search by name if it's not a valid ObjectId
        d = await diseases_col.find_one({"name": {"$regex": f"^{disease_id}$", "$options": "i"}})
        
    if not d:
        raise HTTPException(status_code=404, detail="Disease not found")
        
    return format_disease(d)
