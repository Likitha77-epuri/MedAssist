from fastapi import APIRouter, Depends, HTTPException, status
from database import get_collection
from models import AppointmentCreate, AppointmentResponse
from auth import get_current_user
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter(prefix="", tags=["Appointment Booking"])

def format_appointment(app: dict) -> dict:
    return {
        "id": str(app["_id"]),
        "user_id": app["user_id"],
        "doctor_name": app["doctor_name"],
        "specialty": app["specialty"],
        "date": app["date"],
        "time": app["time"],
        "status": app.get("status", "pending"),
        "created_at": app.get("created_at", datetime.utcnow())
    }

@router.post("/appointment", response_model=AppointmentResponse)
async def create_appointment(payload: AppointmentCreate, current_user: dict = Depends(get_current_user)):
    appointments_col = get_collection("appointments")
    
    # Optional check: does this user already have an appointment at this exact date/time?
    conflict = await appointments_col.find_one({
        "doctor_name": payload.doctor_name,
        "date": payload.date,
        "time": payload.time,
        "status": {"$ne": "cancelled"}
    })
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The doctor already has an appointment booked at this date and time."
        )
        
    new_app = {
        "user_id": current_user["id"],
        "doctor_name": payload.doctor_name,
        "specialty": payload.specialty,
        "date": payload.date,
        "time": payload.time,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    
    result = await appointments_col.insert_one(new_app)
    return format_appointment({**new_app, "_id": result.inserted_id})

@router.get("/appointments", response_model=List[AppointmentResponse])
async def get_appointments(current_user: dict = Depends(get_current_user)):
    appointments_col = get_collection("appointments")
    cursor = appointments_col.find({"user_id": current_user["id"]}).sort("date", 1)
    
    results = []
    async for app in cursor:
        results.append(format_appointment(app))
    return results

@router.put("/appointment/{appointment_id}/cancel", response_model=AppointmentResponse)
async def cancel_appointment(appointment_id: str, current_user: dict = Depends(get_current_user)):
    appointments_col = get_collection("appointments")
    try:
        app = await appointments_col.find_one({
            "_id": ObjectId(appointment_id),
            "user_id": current_user["id"]
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid appointment ID")
        
    if not app:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    await appointments_col.update_one(
        {"_id": app["_id"]},
        {"$set": {"status": "cancelled"}}
    )
    
    app["status"] = "cancelled"
    return format_appointment(app)
