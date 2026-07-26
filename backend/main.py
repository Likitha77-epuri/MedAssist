import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Append the directory containing main.py to Python path to ensure absolute imports succeed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import db_helper
from config import settings

import routes.auth as auth
import routes.chat as chat
import routes.symptoms as symptoms
import routes.diseases as diseases
import routes.medicines as medicines
import routes.reports as reports
import routes.appointments as appointments
import routes.health_records as health_records
import routes.admin as admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    db_helper.connect()
    yield
    # Shutdown actions
    db_helper.disconnect()

app = FastAPI(
    title="MediAssist AI API",
    description="Backend API for MediAssist AI - Educational Health Assistant App",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for the React local server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base health check route
@app.get("/")
async def root():
    return {
        "status": "online",
        "app": "MediAssist AI API",
        "documentation": "/docs"
    }

# Include all endpoint routes
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(symptoms.router)
app.include_router(diseases.router)
app.include_router(medicines.router)
app.include_router(reports.router)
app.include_router(appointments.router)
app.include_router(health_records.router)
app.include_router(admin.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)
