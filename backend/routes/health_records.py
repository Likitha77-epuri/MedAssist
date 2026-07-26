from fastapi import APIRouter, Depends, HTTPException, status
from database import get_collection
from models import HealthRecordCreate, HealthRecordResponse
from auth import get_current_user
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter(prefix="", tags=["Health Tracker"])

def format_record(rec: dict) -> dict:
    return {
        "id": str(rec["_id"]),
        "user_id": rec["user_id"],
        "weight": rec["weight"],
        "height": rec["height"],
        "bmi": rec.get("bmi", 0.0),
        "bp_systolic": rec["bp_systolic"],
        "bp_diastolic": rec["bp_diastolic"],
        "blood_sugar": rec["blood_sugar"],
        "heart_rate": rec["heart_rate"],
        "date": rec.get("date", datetime.utcnow().strftime("%Y-%m-%d")),
        "created_at": rec.get("created_at", datetime.utcnow())
    }

@router.post("/health-record", response_model=HealthRecordResponse)
async def create_health_record(payload: HealthRecordCreate, current_user: dict = Depends(get_current_user)):
    records_col = get_collection("health_records")
    
    # Calculate BMI
    bmi = 0.0
    if payload.height > 0:
        height_m = payload.height / 100.0
        bmi = round(payload.weight / (height_m * height_m), 2)
        
    record_date = payload.date if payload.date else datetime.utcnow().strftime("%Y-%m-%d")
    
    new_record = {
        "user_id": current_user["id"],
        "weight": payload.weight,
        "height": payload.height,
        "bmi": bmi,
        "bp_systolic": payload.bp_systolic,
        "bp_diastolic": payload.bp_diastolic,
        "blood_sugar": payload.blood_sugar,
        "heart_rate": payload.heart_rate,
        "date": record_date,
        "created_at": datetime.utcnow()
    }
    
    result = await records_col.insert_one(new_record)
    return format_record({**new_record, "_id": result.inserted_id})

@router.get("/health-records", response_model=List[HealthRecordResponse])
async def get_health_records(current_user: dict = Depends(get_current_user)):
    records_col = get_collection("health_records")
    cursor = records_col.find({"user_id": current_user["id"]}).sort("date", 1)
    
    results = []
    async for rec in cursor:
        results.append(format_record(rec))
    return results

@router.delete("/health-record/{record_id}", response_model=dict)
async def delete_health_record(record_id: str, current_user: dict = Depends(get_current_user)):
    records_col = get_collection("health_records")
    try:
        result = await records_col.delete_one({
            "_id": ObjectId(record_id),
            "user_id": current_user["id"]
        })
    except Exception:
         raise HTTPException(status_code=400, detail="Invalid record ID")
         
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Health record not found")
        
    return {"message": "Record deleted successfully"}
