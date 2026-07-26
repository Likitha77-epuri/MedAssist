from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- Authentication & Profile ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: str = "user"  # "user" or "admin"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=6)

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = None
    chronic_diseases: Optional[List[str]] = None
    emergency_contact: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = None
    chronic_diseases: Optional[List[str]] = None
    emergency_contact: Optional[str] = None
    created_at: datetime

# --- AI Medical Chatbot ---
class ChatPrompt(BaseModel):
    message: str

class ChatMessage(BaseModel):
    sender: str  # "user" or "ai"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatSessionResponse(BaseModel):
    id: str
    user_id: str
    title: str
    messages: List[ChatMessage]
    created_at: datetime

# --- Symptom Checker ---
class SymptomCheckRequest(BaseModel):
    symptoms: List[str]

class SymptomCheckResponse(BaseModel):
    possible_conditions: List[str]
    risk_level: str  # "Low", "Medium", "High"
    general_advice: str
    when_to_see_doctor: str
    disclaimer: str

# --- Diseases ---
class DiseaseCreate(BaseModel):
    name: str
    description: str
    causes: List[str]
    symptoms: List[str]
    risk_factors: List[str]
    prevention: List[str]
    treatment: List[str]
    lifestyle_tips: List[str]

class DiseaseResponse(BaseModel):
    id: str
    name: str
    description: str
    causes: List[str]
    symptoms: List[str]
    risk_factors: List[str]
    prevention: List[str]
    treatment: List[str]
    lifestyle_tips: List[str]

# --- Medicines ---
class MedicineCreate(BaseModel):
    name: str
    uses: List[str]
    dosage: str
    side_effects: List[str]
    precautions: List[str]
    interactions: List[str]
    storage: str

class MedicineResponse(BaseModel):
    id: str
    name: str
    uses: List[str]
    dosage: str
    side_effects: List[str]
    precautions: List[str]
    interactions: List[str]
    storage: str

# --- Appointment Booking ---
class AppointmentCreate(BaseModel):
    doctor_name: str
    specialty: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM

class AppointmentResponse(BaseModel):
    id: str
    user_id: str
    doctor_name: str
    specialty: str
    date: str
    time: str
    status: str  # "pending", "confirmed", "cancelled"
    created_at: datetime

# --- Health Tracker ---
class HealthRecordCreate(BaseModel):
    weight: float  # kg
    height: float  # cm
    bp_systolic: int  # mmHg
    bp_diastolic: int  # mmHg
    blood_sugar: int  # mg/dL
    heart_rate: int  # bpm
    date: Optional[str] = None  # YYYY-MM-DD (defaults to today)

class HealthRecordResponse(BaseModel):
    id: str
    user_id: str
    weight: float
    height: float
    bmi: float
    bp_systolic: int
    bp_diastolic: int
    blood_sugar: int
    heart_rate: int
    date: str
    created_at: datetime
