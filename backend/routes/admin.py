from fastapi import APIRouter, Depends, HTTPException, status
from database import get_collection
from auth import get_current_admin
from models import DiseaseCreate, MedicineCreate
from bson import ObjectId
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

class AppointmentStatusUpdate(BaseModel):
    status: str  # "confirmed", "cancelled", "pending"

@router.get("/stats", response_model=dict)
async def get_system_stats(admin: dict = Depends(get_current_admin)):
    users_col = get_collection("users")
    chat_col = get_collection("chat_history")
    appointments_col = get_collection("appointments")
    records_col = get_collection("health_records")
    diseases_col = get_collection("diseases")
    medicines_col = get_collection("medicines")
    
    total_users = await users_col.count_documents({})
    total_appointments = await appointments_col.count_documents({})
    total_records = await records_col.count_documents({})
    total_diseases = await diseases_col.count_documents({})
    total_medicines = await medicines_col.count_documents({})
    
    # Calculate Chatbot statistics
    total_sessions = await chat_col.count_documents({})
    # Count total messages across all sessions
    cursor = chat_col.find({}, {"messages": 1})
    total_messages = 0
    async for sess in cursor:
        total_messages += len(sess.get("messages", []))
        
    return {
        "total_users": total_users,
        "total_appointments": total_appointments,
        "total_health_records": total_records,
        "total_diseases": total_diseases,
        "total_medicines": total_medicines,
        "total_chatbot_sessions": total_sessions,
        "total_chatbot_messages": total_messages
    }

# --- User Management ---
@router.get("/users", response_model=List[dict])
async def get_all_users(admin: dict = Depends(get_current_admin)):
    users_col = get_collection("users")
    cursor = users_col.find({})
    
    users = []
    async for u in cursor:
        users.append({
            "id": str(u["_id"]),
            "email": u["email"],
            "full_name": u.get("full_name", ""),
            "role": u.get("role", "user"),
            "created_at": u.get("created_at")
        })
    return users

@router.delete("/user/{user_id}", response_model=dict)
async def delete_user(user_id: str, admin: dict = Depends(get_current_admin)):
    users_col = get_collection("users")
    try:
        result = await users_col.delete_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": "User deleted successfully"}

# --- Appointment Management ---
@router.get("/appointments", response_model=List[dict])
async def get_all_appointments(admin: dict = Depends(get_current_admin)):
    appointments_col = get_collection("appointments")
    users_col = get_collection("users")
    
    cursor = appointments_col.find({}).sort("date", 1)
    
    appointments = []
    async for app in cursor:
        # Fetch user details (guard against invalid ObjectId)
        try:
            user = await users_col.find_one({"_id": ObjectId(app["user_id"])})
        except Exception:
            user = None
        appointments.append({
            "id": str(app["_id"]),
            "user_id": app["user_id"],
            "user_email": user["email"] if user else "Unknown User",
            "user_name": user.get("full_name", "Unknown") if user else "Unknown",
            "doctor_name": app["doctor_name"],
            "specialty": app["specialty"],
            "date": app["date"],
            "time": app["time"],
            "status": app.get("status", "pending"),
            "created_at": app.get("created_at")
        })
    return appointments

@router.put("/appointment/{appointment_id}/status", response_model=dict)
async def update_appointment_status(
    appointment_id: str,
    payload: AppointmentStatusUpdate,
    admin: dict = Depends(get_current_admin)
):
    appointments_col = get_collection("appointments")
    try:
        result = await appointments_col.update_one(
            {"_id": ObjectId(appointment_id)},
            {"$set": {"status": payload.status}}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid appointment ID")
        
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    return {"message": f"Appointment status updated to {payload.status}"}

# --- Disease CRUD Management ---
@router.post("/diseases", response_model=dict)
async def create_disease(payload: DiseaseCreate, admin: dict = Depends(get_current_admin)):
    diseases_col = get_collection("diseases")
    disease_dict = payload.model_dump()
    result = await diseases_col.insert_one(disease_dict)
    return {"message": "Disease created successfully", "id": str(result.inserted_id)}

@router.put("/disease/{disease_id}", response_model=dict)
async def update_disease(disease_id: str, payload: DiseaseCreate, admin: dict = Depends(get_current_admin)):
    diseases_col = get_collection("diseases")
    try:
        result = await diseases_col.update_one(
            {"_id": ObjectId(disease_id)},
            {"$set": payload.model_dump()}
        )
    except Exception:
         raise HTTPException(status_code=400, detail="Invalid disease ID")
         
    if result.matched_count == 0:
         raise HTTPException(status_code=404, detail="Disease not found")
         
    return {"message": "Disease updated successfully"}

@router.delete("/disease/{disease_id}", response_model=dict)
async def delete_disease(disease_id: str, admin: dict = Depends(get_current_admin)):
    diseases_col = get_collection("diseases")
    try:
        result = await diseases_col.delete_one({"_id": ObjectId(disease_id)})
    except Exception:
         raise HTTPException(status_code=400, detail="Invalid disease ID")
         
    if result.deleted_count == 0:
         raise HTTPException(status_code=404, detail="Disease not found")
         
    return {"message": "Disease deleted successfully"}

# --- Medicine CRUD Management ---
@router.post("/medicines", response_model=dict)
async def create_medicine(payload: MedicineCreate, admin: dict = Depends(get_current_admin)):
    medicines_col = get_collection("medicines")
    med_dict = payload.model_dump()
    result = await medicines_col.insert_one(med_dict)
    return {"message": "Medicine created successfully", "id": str(result.inserted_id)}

@router.put("/medicine/{medicine_id}", response_model=dict)
async def update_medicine(medicine_id: str, payload: MedicineCreate, admin: dict = Depends(get_current_admin)):
    medicines_col = get_collection("medicines")
    try:
        result = await medicines_col.update_one(
            {"_id": ObjectId(medicine_id)},
            {"$set": payload.model_dump()}
        )
    except Exception:
         raise HTTPException(status_code=400, detail="Invalid medicine ID")
         
    if result.matched_count == 0:
         raise HTTPException(status_code=404, detail="Medicine not found")
         
    return {"message": "Medicine updated successfully"}

@router.delete("/medicine/{medicine_id}", response_model=dict)
async def delete_medicine(medicine_id: str, admin: dict = Depends(get_current_admin)):
    medicines_col = get_collection("medicines")
    try:
        result = await medicines_col.delete_one({"_id": ObjectId(medicine_id)})
    except Exception:
         raise HTTPException(status_code=400, detail="Invalid medicine ID")
         
    if result.deleted_count == 0:
         raise HTTPException(status_code=404, detail="Medicine not found")
         
    return {"message": "Medicine deleted successfully"}
