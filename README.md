# MediAssist AI — Intelligent Medical Assistant

> **MediAssist AI** is a modern full-stack web application that serves as an educational virtual medical assistant. It features a responsive, visually stunning clinical dashboard with glassmorphism design, an AI chatbot consult, a symptom checker algorithm, searchable drug/disease databases, a PDF lab report analyzer, vitals-log graphing, and appointment booking.

---

## Table of Contents

1. [Features](#-features)
2. [Technology Stack](#-technology-stack)
3. [Project Structure](#-project-structure)
4. [Database Configuration](#-database-configuration)
   - [MongoDB Connection](#mongodb-connection)
   - [Database Collections](#database-collections)
   - [Collection Schemas](#collection-schemas)
5. [Passwords & Authentication](#-passwords--authentication)
   - [Password Hashing (bcrypt)](#password-hashing-bcrypt)
   - [JWT Token System](#jwt-token-system)
   - [Role-Based Access Control](#role-based-access-control)
6. [Environment Variables](#-environment-variables)
   - [Backend `.env`](#backend-env)
   - [Frontend `.env`](#frontend-env)
7. [Installation & Running Locally](#-installation--running-locally)
8. [API Reference](#-api-reference)
   - [Authentication](#authentication-endpoints)
   - [AI Chatbot](#ai-chatbot-endpoints)
   - [Symptom Checker](#symptom-checker-endpoints)
   - [Disease Database](#disease-database-endpoints)
   - [Medicine Database](#medicine-database-endpoints)
   - [Medical Report Analyzer](#medical-report-analyzer-endpoints)
   - [Health Tracker](#health-tracker-endpoints)
   - [Appointment Booking](#appointment-booking-endpoints)
   - [Admin Operations](#admin-operations-endpoints)
9. [Utility Scripts](#-utility-scripts)
10. [Frontend Routing](#-frontend-routing)
11. [AI Provider Configuration](#-ai-provider-configuration)
12. [Medical Disclaimer](#-important-medical-disclaimer)

---

## 🚀 Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Patient Authentication** | Secure login, registration, JWT storage, and direct password resets. |
| 2 | **Clinical Dashboard** | Personalized welcome panels, vital metrics summaries, pending booking statuses, and quick-action shortcuts. |
| 3 | **AI Medical Chatbot** | Interactive chat consults with suggestion prompts, conversation histories, and strict medical disclaimers. |
| 4 | **Symptom Checker** | Checklist evaluation mapping symptoms to **Low**, **Medium**, or **High** risk levels, self-care directives, and clinical alerts. |
| 5 | **Disease Database** | Searchable records of conditions explaining causes, symptoms, and treatment instructions. |
| 6 | **Medicine Directory** | Look up drug dosages, side effects, precautions, storage tips, and dangerous interactions. |
| 7 | **Lab Report Analyzer** | Upload lab report PDFs. Extracts parameters (Hb, Cholesterol, Sugar) and translates clinical values into plain English. |
| 8 | **Vitals Health Tracker** | Log BP, sugar, pulse, and BMI with responsive historical trend charts plotted using Chart.js. |
| 9 | **Appointment Booking** | Book dates/slots with department specialists (Cardiology, Pediatrics, Endocrinology, etc.). |
| 10 | **Emergency Center** | Flashing SOS beacon with emergency ambulance dispatcher countdown simulator, hotline numbers, and first aid manuals. |
| 11 | **User Profile** | Edit personal details (allergies, chronic ailments, emergency contact details). |
| 12 | **Admin Dashboard** | System load stats, patient management tools, appointment status triggers, and CRUD panels for diseases & medicines. |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.2.7 | UI library |
| **Vite** | ^8.1.1 | Build tool & dev server |
| **Tailwind CSS** | ^3.4.19 | Utility-first CSS framework (Glassmorphism design) |
| **Chart.js** | ^4.5.1 | Vitals trend charts |
| **React Chart.js 2** | ^5.3.1 | React wrapper for Chart.js |
| **Axios** | ^1.18.1 | HTTP client |
| **Lucide React** | ^1.24.0 | Icon library |
| **React Router DOM** | ^7.18.1 | Client-side routing |
| **Oxlint** | ^1.71.0 | Linter |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Server language |
| **FastAPI** | 0.111.0 | Web framework (ASGI) |
| **Uvicorn** | 0.30.1 | ASGI server |
| **Motor** | 3.5.1 | Async MongoDB driver |
| **PyMongo** | 4.8.0 | MongoDB client (sync, used in seed script) |
| **PyJWT** | 2.8.0 | JWT token creation & verification |
| **bcrypt** | 4.1.3 | Password hashing |
| **Pydantic** | 2.7.4 | Data validation & serialization |
| **Pydantic-Settings** | 2.3.4 | Environment variable management |
| **python-multipart** | 0.0.9 | Form data parsing |
| **PyPDF** | 4.2.0 | PDF text extraction (lab reports) |
| **OpenAI** | 1.35.3 | OpenAI API client SDK |
| **Requests** | 2.32.3 | HTTP requests (Gemini REST API) |
| **python-dotenv** | 1.0.1 | `.env` file loading |

### Database
| Technology | Purpose |
|------------|---------|
| **MongoDB** | Document database (Atlas or local `localhost:27017`) |

### API Integrations
| Service | Usage |
|---------|-------|
| **Google Gemini API** | LLM-powered chatbot & symptom analysis (REST) |
| **OpenAI API** | LLM-powered chatbot & symptom analysis (SDK) |

---

## 📂 Project Structure

```
Medical AI/
├── README.md                     # This file
├── check_db.py                   # Quick DB inspection script
├── check_settings.py             # Settings verification script
├── test_api.py                   # API endpoint testing script
├── backend/
│   ├── .env                      # Backend environment secrets
│   ├── auth.py                   # JWT, bcrypt, role guards
│   ├── config.py                 # Pydantic Settings schema
│   ├── database.py               # Async MongoDB client (Motor)
│   ├── main.py                   # FastAPI server entrypoint
│   ├── models.py                 # Pydantic request/response schemas
│   ├── requirements.txt          # Python dependencies
│   ├── seed.py                   # Database pre-population script
│   ├── verify_login.py           # Login verification utility
│   ├── reset_password.py         # Password reset utility
│   └── routes/
│       ├── __init__.py
│       ├── admin.py              # Admin CRUD & stats
│       ├── appointments.py       # Appointment booking endpoints
│       ├── auth.py               # Register, login, profile, forgot password
│       ├── chat.py               # AI chatbot endpoints
│       ├── diseases.py           # Disease database endpoints
│       ├── health_records.py     # Vitals tracker endpoints
│       ├── medicines.py          # Medicine database endpoints
│       ├── reports.py            # Lab report PDF analyzer
│       └── symptoms.py           # Symptom checker endpoints
└── frontend/
    ├── .env                      # Frontend API URL
    ├── .gitignore
    ├── .oxlintrc.json
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── App.jsx               # React Router configuration
        ├── main.jsx              # App bootstrap
        ├── index.css             # Tailwind + glass styles
        ├── App.css
        ├── assets/               # Static images/icons
        ├── components/
        │   ├── GlassCard.jsx     # Reusable glassmorphism card
        │   ├── Layout.jsx        # Main layout wrapper
        │   ├── ProtectedRoute.jsx # Auth guard
        │   └── AdminRoute.jsx    # Admin-only guard
        ├── context/
        │   ├── AuthContext.jsx   # JWT auth state management
        │   └── ToastContext.jsx  # Toast notification system
        ├── services/
        │   └── api.js            # Axios instance with JWT interceptor
        └── pages/
            ├── LandingPage.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── AIChat.jsx
            ├── SymptomChecker.jsx
            ├── DiseaseSearch.jsx
            ├── MedicineSearch.jsx
            ├── MedicalReportAnalyzer.jsx
            ├── HealthTracker.jsx
            ├── AppointmentBooking.jsx
            ├── Emergency.jsx
            ├── UserProfile.jsx
            └── AdminDashboard.jsx
```

---

## 🗄️ Database Configuration

### MongoDB Connection

The application connects to MongoDB using the **Motor** async driver. The connection string and database name are configured via environment variables.

**Default connection (local MongoDB):**
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=mediassist_db
```

**MongoDB Atlas (cloud):**
```
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=mediassist_db
```

> 💡 **Tip:** If using Atlas, ensure your IP address is whitelisted in the Atlas dashboard and that the connection string includes the correct database user credentials.

The connection is managed in [`backend/database.py`](backend/database.py):

```python
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

    def connect(self):
        self.client = AsyncIOMotorClient(settings.mongodb_url)
        self.db = self.client[settings.database_name]

    def disconnect(self):
        if self.client:
            self.client.close()

db_helper = Database()

def get_collection(name: str):
    if db_helper.db is None:
        db_helper.connect()
    return db_helper.db[name]
```

The database connection is automatically established on application startup via FastAPI's **lifespan** event in `backend/main.py`:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    db_helper.connect()    # Connect on startup
    yield
    db_helper.disconnect() # Disconnect on shutdown
```

### Database Collections

The `mediassist_db` database contains the following collections:

| Collection | Description | Seeded? |
|------------|-------------|---------|
| `users` | Registered patient & admin accounts | No (created on registration) |
| `chat_history` | AI chatbot conversation sessions | No (created on chat) |
| `diseases` | Medical disease records | ✅ Yes (seed.py) |
| `medicines` | Drug information records | ✅ Yes (seed.py) |
| `appointments` | Doctor appointment bookings | No (created on booking) |
| `health_records` | Vitals & health tracker entries | No (created on log) |

### Collection Schemas

#### `users` Collection
```javascript
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "password": "$2b$12$...hashed_bcrypt...",   // bcrypt hash
  "full_name": "John Doe",
  "role": "user",                              // "user" or "admin"
  "age": 30,
  "gender": "Male",
  "blood_group": "O+",
  "allergies": ["Penicillin"],
  "chronic_diseases": ["Hypertension"],
  "emergency_contact": "+91-9876543210",
  "created_at": ISODate("2024-01-15T10:30:00Z")
}
```

#### `chat_history` Collection
```javascript
{
  "_id": ObjectId("..."),
  "user_id": "user_object_id_string",
  "title": "Chat session title...",
  "messages": [
    {
      "sender": "user",                        // or "ai"
      "content": "I have a fever...",
      "timestamp": ISODate("2024-01-15T10:30:00Z")
    },
    {
      "sender": "ai",
      "content": "Based on your query...",
      "timestamp": ISODate("2024-01-15T10:30:05Z")
    }
  ],
  "created_at": ISODate("2024-01-15T10:30:00Z")
}
```

#### `diseases` Collection
```javascript
{
  "_id": ObjectId("..."),
  "name": "Common Cold",
  "description": "A viral infection of your nose and throat...",
  "causes": ["Rhinovirus", "Coronavirus"],
  "symptoms": ["Runny nose", "Sore throat", "Cough"],
  "risk_factors": ["Age", "Weakened immune system"],
  "prevention": ["Wash hands frequently", "Avoid close contact"],
  "treatment": ["Rest", "Hydration", "Pain relievers"],
  "lifestyle_tips": ["Keep room warm", "Sip warm liquids"]
}
```

#### `medicines` Collection
```javascript
{
  "_id": ObjectId("..."),
  "name": "Acetaminophen",
  "uses": ["Pain relief", "Fever reduction"],
  "dosage": "Adults: 325 mg to 650 mg every 4 to 6 hours...",
  "side_effects": ["Liver damage", "Nausea", "Allergic reaction"],
  "precautions": ["Avoid alcohol", "Check other medication labels"],
  "interactions": ["Warfarin", "Alcohol", "Other acetaminophen products"],
  "storage": "Store at room temperature (59°F to 86°F)..."
}
```

#### `appointments` Collection
```javascript
{
  "_id": ObjectId("..."),
  "user_id": "user_object_id_string",
  "doctor_name": "Dr. Sarah Johnson",
  "specialty": "Cardiology",
  "date": "2024-02-20",          // YYYY-MM-DD
  "time": "14:30",               // HH:MM
  "status": "pending",           // "pending", "confirmed", "cancelled"
  "created_at": ISODate("2024-01-15T10:30:00Z")
}
```

#### `health_records` Collection
```javascript
{
  "_id": ObjectId("..."),
  "user_id": "user_object_id_string",
  "weight": 70.5,                // kg
  "height": 175,                 // cm
  "bmi": 23.0,                   // calculated
  "bp_systolic": 120,            // mmHg
  "bp_diastolic": 80,            // mmHg
  "blood_sugar": 95,             // mg/dL
  "heart_rate": 72,              // bpm
  "date": "2024-01-15",          // YYYY-MM-DD
  "created_at": ISODate("2024-01-15T10:30:00Z")
}
```

---

## 🔐 Passwords & Authentication

### Password Hashing (bcrypt)

All user passwords are hashed using **bcrypt** with an automatically generated salt. Passwords are **never stored in plaintext**.

**Implementation** (`backend/auth.py`):

```python
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False
```

- **Algorithm:** bcrypt
- **Salt rounds:** 12 (default `gensalt()`)
- **Hash format:** `$2b$12$...` (60-character string)

### JWT Token System

Authentication uses **JSON Web Tokens (JWT)** with the **HS256** algorithm.

**Token creation** (`backend/auth.py`):

```python
import jwt
from datetime import datetime, timedelta, timezone
from config import settings

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm
    )
    return encoded_jwt
```

**Token payload structure:**
```json
{
  "sub": "user_object_id_string",   // Subject (user ID)
  "role": "user",                   // User role
  "exp": 1705320600                 // Expiration timestamp (UTC)
}
```

**Token expiration:** 120 minutes (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`)

**Frontend storage:** The JWT token is stored in `localStorage` under the key `token` and sent as a `Bearer` token in the `Authorization` header on every API request via an Axios interceptor (`frontend/src/services/api.js`).

### Role-Based Access Control

The system implements two roles:

| Role | Description |
|------|-------------|
| `user` | Standard patient account. Can access all features except admin operations. |
| `admin` | Full access. Can manage users, appointments, diseases, and medicines. |

**Auto-admin on first registration:**
The first user to register automatically receives the `admin` role:

```python
# backend/routes/auth.py — /register endpoint
user_count = await users_col.count_documents({})
assigned_role = "admin" if user_count == 0 else user_data.role
```

**Admin guard** (`backend/auth.py`):
```python
async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin permissions required"
        )
    return current_user
```

### Password Reset

Users can reset their password directly by providing their email and a new password:

```
POST /forgot-password
{
  "email": "user@example.com",
  "new_password": "newSecurePassword123"
}
```

The new password is hashed with bcrypt before being stored. The old password hash is completely replaced.

---

## ⚙️ Environment Variables

### Backend `.env`

Located at `backend/.env`. These variables are loaded by `backend/config.py` using Pydantic Settings.

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection string (local or Atlas) |
| `DATABASE_NAME` | `mediassist_db` | Target database name |
| `JWT_SECRET` | `super_secret_mediassist_key_123456_change_me_in_production` | Secret key for JWT signing (⚠️ **Change in production!**) |
| `JWT_ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `120` | JWT token lifetime in minutes |
| `GEMINI_API_KEY` | *(empty)* | Google Gemini API key for real LLM responses |
| `OPENAI_API_KEY` | *(empty)* | OpenAI API key for real LLM responses |
| `PORT` | `8000` | Backend server port |
| `HOST` | `0.0.0.0` | Backend server bind address |

**Current `backend/.env` contents:**
```ini
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=mediassist_db
JWT_SECRET=super_secret_mediassist_key_123456_change_me_in_production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120

# AI Provider API Keys (Fill one or both to enable real LLM features. If blank, the app runs in mock AI mode)
GEMINI_API_KEY=
OPENAI_API_KEY=

PORT=8000
HOST=0.0.0.0
```

> ⚠️ **Security Warning:** The default `JWT_SECRET` is intentionally weak and must be changed before deploying to production. Generate a strong secret using:
> ```bash
> python -c "import secrets; print(secrets.token_urlsafe(32))"
> ```

### Frontend `.env`

Located at `frontend/.env`. Uses Vite's `VITE_` prefix convention.

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

**Current `frontend/.env` contents:**
```ini
VITE_API_URL=http://localhost:8000
```

> 💡 **Note:** Vite only exposes environment variables prefixed with `VITE_` to the client-side code. The API URL is accessed in `frontend/src/services/api.js` via `import.meta.env.VITE_API_URL`.

---

## 🏃 Installation & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.8+)
- [MongoDB](https://www.mongodb.com/) (running on `localhost:27017` or Atlas connection string)

---

### Step 1: Running the MongoDB Database

Ensure your MongoDB server is started locally (standard port `27017`) or configure an Atlas cluster.

**Local MongoDB (Windows):**
```cmd
net start MongoDB
```
or start `mongod` manually:
```cmd
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

---

### Step 2: Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. The virtual environment is already created under `venv/`. Activate it:
   - **Windows PowerShell:**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Command Prompt:**
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables in `backend/.env` (optional: add `GEMINI_API_KEY` or `OPENAI_API_KEY` for real LLM results, otherwise the app runs on a smart simulator).

5. Pre-populate database with diseases and medicines:
   ```bash
   python seed.py
   ```

6. Run the FastAPI development server:
   ```bash
   uvicorn main:app --port 8000 --reload
   ```
   *The API documentation is available at: [http://localhost:8000/docs](http://localhost:8000/docs)*

---

### Step 3: Frontend Setup (React)

1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install npm packages:
   ```bash
   npm install
   ```

3. Configure target backend address in `frontend/.env` (defaults to `http://localhost:8000`).

4. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *Open the application at: [http://localhost:5173/](http://localhost:5173/)*

---

### Step 4: First-Time Setup

1. **Register the first user** — this user automatically becomes the **admin**.
2. **Seed the database** (if not already done):
   ```bash
   cd backend
   python seed.py
   ```
3. **Verify the database** (optional):
   ```bash
   python check_db.py
   ```

---

## 📡 API Reference

All endpoints are prefixed with the base URL `http://localhost:8000`. Authentication-required endpoints expect a `Bearer <JWT_TOKEN>` in the `Authorization` header.

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Register a new user (first user = admin) |
| `POST` | `/login` | ❌ | Login with email & password, returns JWT |
| `POST` | `/forgot-password` | ❌ | Reset password by email |
| `GET` | `/profile` | ✅ | Get current user profile |
| `PUT` | `/profile` | ✅ | Update user profile (name, age, allergies, etc.) |

**Register:**
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "full_name": "John Doe"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {"id": "...", "email": "...", "full_name": "...", "role": "user"}
}
```

### AI Chatbot Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/chat` | ✅ | Send a message, get AI response |
| `GET` | `/chat/sessions` | ✅ | List all chat sessions |
| `GET` | `/chat/session/{session_id}` | ✅ | Get full session with messages |
| `DELETE` | `/chat/session/{session_id}` | ✅ | Delete a chat session |

### Symptom Checker Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/symptoms` | ✅ | Submit symptoms, get risk analysis |

**Request:**
```json
{"symptoms": ["fever", "cough", "sore throat"]}
```

**Response:**
```json
{
  "possible_conditions": ["Influenza (Flu)", "Common Cold"],
  "risk_level": "Medium",
  "general_advice": "Rest, drink warm fluids...",
  "when_to_see_doctor": "See a doctor if fever remains above 102°F...",
  "disclaimer": "DISCLAIMER: This analysis is for educational purposes only..."
}
```

### Disease Database Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/diseases?query=<search>` | ❌ | List all diseases (optional search) |
| `GET` | `/disease/{disease_id}` | ❌ | Get a single disease by ID or name |

### Medicine Database Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/medicines?query=<search>` | ❌ | List all medicines (optional search) |
| `GET` | `/medicine/{medicine_id}` | ❌ | Get a single medicine by ID or name |

### Medical Report Analyzer Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/upload-report` | ✅ | Upload a PDF lab report for analysis |

**Request:** `multipart/form-data` with a `file` field (PDF only).

### Health Tracker Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/health-record` | ✅ | Create a new vitals record |
| `GET` | `/health-records` | ✅ | List all health records for the user |
| `DELETE` | `/health-record/{record_id}` | ✅ | Delete a health record |

**Create Health Record:**
```json
{
  "weight": 70.5,
  "height": 175,
  "bp_systolic": 120,
  "bp_diastolic": 80,
  "blood_sugar": 95,
  "heart_rate": 72,
  "date": "2024-01-15"
}
```

### Appointment Booking Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/appointment` | ✅ | Book a new appointment |
| `GET` | `/appointments` | ✅ | List user's appointments |
| `PUT` | `/appointment/{appointment_id}/cancel` | ✅ | Cancel an appointment |

### Admin Operations Endpoints

All admin endpoints require `admin` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/stats` | System statistics (users, appointments, records, etc.) |
| `GET` | `/admin/users` | List all users |
| `DELETE` | `/admin/user/{user_id}` | Delete a user |
| `GET` | `/admin/appointments` | List all appointments (with user details) |
| `PUT` | `/admin/appointment/{appointment_id}/status` | Update appointment status |
| `POST` | `/admin/diseases` | Create a new disease record |
| `PUT` | `/admin/disease/{disease_id}` | Update a disease record |
| `DELETE` | `/admin/disease/{disease_id}` | Delete a disease record |
| `POST` | `/admin/medicines` | Create a new medicine record |
| `PUT` | `/admin/medicine/{medicine_id}` | Update a medicine record |
| `DELETE` | `/admin/medicine/{medicine_id}` | Delete a medicine record |

---

## 🔧 Utility Scripts

### `backend/seed.py`
Pre-populates the database with 5 diseases and 5 medicines. Safe to run multiple times (skips existing records).

```bash
cd backend
python seed.py
```

**Seeded diseases:** Common Cold, Influenza (Flu), Strep Throat, Gastroenteritis (Stomach Flu), Diabetes Mellitus, Hypertension (High Blood Pressure)

**Seeded medicines:** Acetaminophen, Ibuprofen, Amoxicillin, Metformin, Lisinopril

### `check_db.py`
Quickly inspects the database to verify connectivity and list registered users.

```bash
python check_db.py
```

### `check_settings.py`
Verifies that all environment settings are correctly loaded.

```bash
python check_settings.py
```

### `test_api.py`
Runs a suite of API endpoint tests against the running server.

```bash
python test_api.py
```

### `backend/verify_login.py`
Utility script to verify a user's login credentials directly.

```bash
python backend/verify_login.py
```

### `backend/reset_password.py`
Utility script to reset a user's password directly in the database.

```bash
python backend/reset_password.py
```

---

## 🌐 Frontend Routing

The application uses React Router DOM v7 with the following routes:

| Path | Component | Auth Required | Admin Only |
|------|-----------|---------------|------------|
| `/` | `LandingPage` | ❌ | ❌ |
| `/login` | `Login` | ❌ | ❌ |
| `/register` | `Register` | ❌ | ❌ |
| `/dashboard` | `Dashboard` | ✅ | ❌ |
| `/chat` | `AIChat` | ✅ | ❌ |
| `/symptoms` | `SymptomChecker` | ✅ | ❌ |
| `/diseases` | `DiseaseSearch` | ✅ | ❌ |
| `/medicines` | `MedicineSearch` | ✅ | ❌ |
| `/analyzer` | `MedicalReportAnalyzer` | ✅ | ❌ |
| `/tracker` | `HealthTracker` | ✅ | ❌ |
| `/booking` | `AppointmentBooking` | ✅ | ❌ |
| `/emergency` | `Emergency` | ✅ | ❌ |
| `/profile` | `UserProfile` | ✅ | ❌ |
| `/admin` | `AdminDashboard` | ✅ | ✅ |
| `*` | Redirect to `/` | — | — |

Protected routes are wrapped in `ProtectedRoute` (checks for valid JWT), and the admin route is additionally wrapped in `AdminRoute` (checks for `admin` role).

---

## 🤖 AI Provider Configuration

The application supports two AI providers for the chatbot and symptom checker. If neither API key is configured, the app falls back to a built-in **mock AI** with rule-based responses.

### Priority Order
1. **Google Gemini API** (via REST) — if `GEMINI_API_KEY` is set
2. **OpenAI API** (via SDK) — if `OPENAI_API_KEY` is set
3. **Mock AI** (built-in rule-based responses) — fallback

### Getting API Keys

**Google Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project or select an existing one
3. Navigate to "Get API Key"
4. Copy the key and add it to `backend/.env`:
   ```ini
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

**OpenAI API Key:**
1. Go to [OpenAI Dashboard](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to `backend/.env`:
   ```ini
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Mock AI Mode
When no API keys are configured, the application uses a sophisticated rule-based system that handles common medical queries (fever, headache, diabetes, cough, sore throat) and provides generic advice for other queries. All responses include the required medical disclaimer.

---

## ⚕️ Important Medical Disclaimer

This application is for **educational, demonstration, and simulation purposes only**. It **does not** provide real medical diagnoses, clinical classifications, or replace licensed healthcare practitioners. The AI chatbot, symptom checker, and lab report analyzer use simulated or LLM-generated responses that should never be relied upon for actual medical decision-making.

**Always consult a certified medical professional for genuine clinical concerns.** In case of acute emergencies, immediately contact local emergency lines (like 911 or your country's emergency number).

---

## 📄 License

This project is provided as-is for educational purposes. See the medical disclaimer above for important usage restrictions.

---

*Made with ❤️ using React, FastAPI, MongoDB, and Tailwind CSS.*





---

## ⚡ Quick Start — How to Run the Project

> **You need 2 separate terminal windows** — one for the backend, one for the frontend.

---

### 🖥️ Terminal 1 — Backend (Python / FastAPI)

```powershell
# Step 1: Go into the backend folder
cd backend

# Step 2: Activate the Python virtual environment
.\venv\Scripts\Activate.ps1

# Step 3: (First time only) Install Python dependencies
pip install -r requirements.txt

# Step 4: (First time only) Seed the database with sample diseases & medicines
python seed.py

# Step 5: Start the FastAPI backend server
uvicorn main:app --port 8000 --reload
```

✅ Backend is running at: **http://localhost:8000**  
📄 API docs available at: **http://localhost:8000/docs**

---

### 🌐 Terminal 2 — Frontend (React / Vite)

```powershell
# Step 1: Go into the frontend folder
cd frontend

# Step 2: (First time only) Install Node.js dependencies
npm install

# Step 3: Start the React development server
npm run dev
```

✅ Frontend is running at: **http://localhost:5173**

---

### ⚡ One-Liner Shortcuts (after first-time setup)

Once everything is installed, just use these every time:

```powershell
# Terminal 1 — Backend
cd backend; .\venv\Scripts\Activate.ps1; uvicorn main:app --port 8000 --reload
```

```powershell
# Terminal 2 — Frontend
cd frontend; npm run dev
```

---

### 🔑 Admin Login Credentials

| Field | Value |
|-------|-------|
| **URL** | http://localhost:5173/login |
| **Email** | `test@test.com` |
| **Password** | `Admin@123` |
| **Role** | Admin (full access) |

> 💡 **Note:** The backend must be running **before** you open the frontend, otherwise login will fail.

---

## 🌐 Full Cloud Deployment Guide (Free Hosting)

Follow this 3-step guide to deploy **MediAssist AI** live on the web for free using **MongoDB Atlas**, **Render**, and **Vercel**.

---

### Step 1: Database (MongoDB Atlas — Free 512MB)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create an **M0 Free Cluster**.
3. Under **Database Access**, create a user (e.g., `admin_user`) and password.
4. Under **Network Access**, click **Add IP Address** $\rightarrow$ select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** $\rightarrow$ **Drivers** to copy your MongoDB Connection String:
   ```
   mongodb+srv://admin_user:<password>@cluster0.xxxxx.mongodb.net/mediassist_db?retryWrites=true&w=majority
   ```

---

### Step 2: Backend Deployment (Render / Railway)

1. Push your project to **GitHub**.
2. Sign up on [Render.com](https://render.com/).
3. Click **New +** $\rightarrow$ **Web Service**.
4. Connect your GitHub repository.
5. Configure settings:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add **Environment Variables** under *Advanced*:
   - `PYTHON_VERSION`: `3.11.9` *(Crucial: fixes Python 3.14 build errors on Render)*
   - `MONGODB_URL`: *(Your MongoDB Atlas connection string)*
   - `DATABASE_NAME`: `mediassist_db`
   - `JWT_SECRET`: *(Any secret long key string)*
   - `JWT_ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `120`
   - `GEMINI_API_KEY`: *(Optional)*
   - `OPENAI_API_KEY`: *(Optional)*
7. Click **Create Web Service**. Copy your live backend URL (e.g. `https://mediassist-backend.onrender.com`).


---

### Step 3: Frontend Deployment (Vercel)

1. Sign up on [Vercel](https://vercel.com/).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository.
4. Configure settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add **Environment Variable**:
   - `VITE_API_URL`: `https://mediassist-backend.onrender.com` *(Your Render URL)*
6. Click **Deploy**.

🎉 Your app will be live with a custom HTTPS URL (e.g. `https://mediassist-ai.vercel.app`)!

