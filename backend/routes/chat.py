from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
import requests

from database import get_collection
from auth import get_current_user
from config import settings
from openai import OpenAI

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    session_id: str
    title: str

SYSTEM_PROMPT = """You are MediAssist AI, a professional medical chatbot.
Your goals:
1. Answer the user's questions professionally and compassionately.
2. Explain potential symptoms and suggest possible conditions.
3. Recommend general self-care and lifestyle tips.
4. Highlight emergency symptoms that require immediate medical attention (e.g., chest pain, breathing difficulty).
5. Never state "I diagnose you with..." or claim to replace a doctor. Keep it advisory.
6. End all responses with a clear medical disclaimer: "DISCLAIMER: This information is for educational purposes only and does not constitute medical advice or a diagnosis. Please consult a qualified healthcare professional for any medical concerns or emergency care."
"""

def mock_medical_ai(user_msg: str) -> str:
    user_msg_lower = user_msg.lower()
    
    if "fever" in user_msg_lower or "temperature" in user_msg_lower:
        return (
            "Based on your query, a fever is a temporary increase in body temperature, often due to an illness. "
            "It is a sign that your body's immune system is fighting off an infection (viral or bacterial).\n\n"
            "**Possible Conditions:**\n"
            "- Common Cold or Influenza (Flu)\n"
            "- Viral gastroenteritis\n"
            "- Bacterial infections (such as UTI or strep throat)\n\n"
            "**General Self-Care Tips:**\n"
            "- Drink plenty of fluids (water, clear broths, electrolyte solutions) to prevent dehydration.\n"
            "- Rest as much as possible.\n"
            "- Use over-the-counter fever reducers like acetaminophen or ibuprofen according to package instructions.\n"
            "- Keep your room cool and wear lightweight clothing.\n\n"
            "**Emergency Symptoms to Watch For:**\n"
            "- High fever exceeding 103°F (39.4°C) that doesn't respond to medication.\n"
            "- Severe headache, stiff neck, short of breath, or confusion. Seek immediate care if these arise.\n\n"
            "DISCLAIMER: This information is for educational purposes only and does not constitute medical advice or a diagnosis. "
            "Please consult a qualified healthcare professional for any medical concerns or emergency care."
        )
    elif "headache" in user_msg_lower or "migraine" in user_msg_lower:
        return (
            "Headaches are characterized by pain in the head or upper neck region. They can range from dull and throbbing to sharp and severe.\n\n"
            "**Possible Conditions:**\n"
            "- Tension headache (common, stress-related)\n"
            "- Migraine (often accompanied by nausea, sensitivity to light/sound)\n"
            "- Dehydration headache\n"
            "- Sinus congestion\n\n"
            "**General Self-Care Tips:**\n"
            "- Rest in a quiet, dark, well-ventilated room.\n"
            "- Apply a warm or cool compress to your forehead or the back of your neck.\n"
            "- Ensure you are hydrated. Drink a full glass of water.\n"
            "- Practice relaxation techniques like deep breathing.\n\n"
            "**Emergency Symptoms to Watch For:**\n"
            "- A sudden, extremely severe headache (\"thunderclap\" headache).\n"
            "- Headache accompanied by fever, stiff neck, confusion, double vision, numbness, or difficulty speaking. Seek emergency care immediately.\n\n"
            "DISCLAIMER: This information is for educational purposes only and does not constitute medical advice or a diagnosis. "
            "Please consult a qualified healthcare professional for any medical concerns or emergency care."
        )
    elif "diabetes" in user_msg_lower or "blood sugar" in user_msg_lower:
        return (
            "Diabetes mellitus refers to a group of diseases that affect how your body uses blood sugar (glucose), which is a vital energy source.\n\n"
            "**Symptoms of Diabetes include:**\n"
            "- Increased thirst and frequent urination\n"
            "- Extreme hunger and unexplained weight loss\n"
            "- Fatigue and irritability\n"
            "- Blurry vision and slow-healing sores\n\n"
            "**General Lifestyle Tips:**\n"
            "- Eat a diet high in fiber, whole grains, and lean proteins while minimizing refined sugars.\n"
            "- Engage in regular aerobic exercise (like brisk walking for 30 minutes daily).\n"
            "- Monitor blood sugar regularly if diagnosed.\n\n"
            "**Emergency Symptoms to Watch For:**\n"
            "- Diabetic ketoacidosis (DKA) symptoms: rapid breathing, sweet-smelling breath, extreme nausea, vomiting, confusion.\n\n"
            "DISCLAIMER: This information is for educational purposes only and does not constitute medical advice or a diagnosis. "
            "Please consult a qualified healthcare professional for any medical concerns or emergency care."
        )
    elif "cough" in user_msg_lower or "sore throat" in user_msg_lower:
        return (
            "Coughing is a reflex action to clear your airways of mucus, irritants, or foreign particles. A sore throat is painful irritation of the throat.\n\n"
            "**Possible Conditions:**\n"
            "- Upper respiratory tract infection (viral cold, flu)\n"
            "- Bronchitis or allergies\n"
            "- Pharyngitis (Strep throat or viral throat infection)\n"
            "- Acid reflux (GERD)\n\n"
            "**General Self-Care Tips:**\n"
            "- Gargle with warm salt water (1/2 teaspoon of salt in a glass of warm water).\n"
            "- Drink warm liquids (tea with honey, lemon, warm water).\n"
            "- Use a humidifier or take a steamy shower.\n"
            "- Rest your voice.\n\n"
            "**Emergency Symptoms to Watch For:**\n"
            "- Difficulty breathing or swallowing, coughing up blood, or a high fever. Please seek medical assistance.\n\n"
            "DISCLAIMER: This information is for educational purposes only and does not constitute medical advice or a diagnosis. "
            "Please consult a qualified healthcare professional for any medical concerns or emergency care."
        )
    else:
        return (
            f"Thank you for sharing your concern: \"{user_msg}\". As your virtual medical assistant, I am here to help guide you.\n\n"
            "**General Advice:**\n"
            "- Monitor your symptoms closely, including when they started and their severity.\n"
            "- Ensure you are getting adequate rest, maintaining hydration, and avoiding physical strain.\n"
            "- Avoid self-medicating with prescription drugs without a doctor's confirmation.\n\n"
            "**When to See a Professional:**\n"
            "- If your symptoms persist for more than 3-5 days without improvement, or if they worsen over time, a check-up is recommended.\n"
            "**Emergency Warning:** If you experience severe chest pain, extreme shortness of breath, sudden numbness or paralysis, or a severe sudden headache, call emergency services immediately.\n\n"
            "DISCLAIMER: This information is for educational purposes only and does not constitute medical advice or a diagnosis. "
            "Please consult a qualified healthcare professional for any medical concerns or emergency care."
        )

def call_gemini_api(prompt: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.gemini_api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"{SYSTEM_PROMPT}\nUser health query: {prompt}"}
                ]
            }
        ]
    }
    response = requests.post(url, json=payload, timeout=25)
    response.raise_for_status()
    res_json = response.json()
    return res_json['candidates'][0]['content']['parts'][0]['text']

def generate_llm_response(prompt: str) -> str:
    # 1. Try Gemini REST API
    if settings.gemini_api_key:
        try:
            return call_gemini_api(prompt)
        except Exception as e:
            print(f"Gemini REST API error: {e}")
            
    # 2. Try OpenAI
    if settings.openai_api_key:
        try:
            client = OpenAI(api_key=settings.openai_api_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API error: {e}")
            
    # 3. Fallback
    return mock_medical_ai(prompt)

@router.post("", response_model=ChatResponse)
async def post_chat(payload: ChatRequest, current_user: dict = Depends(get_current_user)):
    chat_col = get_collection("chat_history")
    
    session_id = payload.session_id
    session = None
    
    if session_id:
        try:
            session = await chat_col.find_one({
                "_id": ObjectId(session_id),
                "user_id": current_user["id"]
            })
        except Exception:
            session = None
            
    ai_response = generate_llm_response(payload.message)
    
    new_user_message = {
        "sender": "user",
        "content": payload.message,
        "timestamp": datetime.utcnow()
    }
    new_ai_message = {
        "sender": "ai",
        "content": ai_response,
        "timestamp": datetime.utcnow()
    }
    
    if session:
        await chat_col.update_one(
            {"_id": session["_id"]},
            {"$push": {"messages": {"$each": [new_user_message, new_ai_message]}}}
        )
        return ChatResponse(
            message=ai_response,
            session_id=str(session["_id"]),
            title=session.get("title", "Medical Consultation")
        )
    else:
        title = payload.message[:40] + "..." if len(payload.message) > 40 else payload.message
        new_session = {
            "user_id": current_user["id"],
            "title": title,
            "messages": [new_user_message, new_ai_message],
            "created_at": datetime.utcnow()
        }
        result = await chat_col.insert_one(new_session)
        return ChatResponse(
            message=ai_response,
            session_id=str(result.inserted_id),
            title=title
        )

@router.get("/sessions", response_model=List[dict])
async def get_sessions(current_user: dict = Depends(get_current_user)):
    chat_col = get_collection("chat_history")
    cursor = chat_col.find({"user_id": current_user["id"]}).sort("created_at", -1)
    sessions = []
    async for s in cursor:
        sessions.append({
            "id": str(s["_id"]),
            "title": s.get("title", "Medical Chat"),
            "created_at": s.get("created_at", datetime.utcnow()),
            "last_message": s["messages"][-1]["content"] if s.get("messages") else ""
        })
    return sessions

@router.get("/session/{session_id}", response_model=dict)
async def get_session_details(session_id: str, current_user: dict = Depends(get_current_user)):
    chat_col = get_collection("chat_history")
    try:
        session = await chat_col.find_one({
            "_id": ObjectId(session_id),
            "user_id": current_user["id"]
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID")
        
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
        
    formatted_messages = []
    for msg in session["messages"]:
        formatted_messages.append({
            "sender": msg["sender"],
            "content": msg["content"],
            "timestamp": msg["timestamp"]
        })
        
    return {
        "id": str(session["_id"]),
        "title": session.get("title", ""),
        "messages": formatted_messages,
        "created_at": session.get("created_at")
    }

@router.delete("/session/{session_id}", response_model=dict)
async def delete_session(session_id: str, current_user: dict = Depends(get_current_user)):
    chat_col = get_collection("chat_history")
    try:
        result = await chat_col.delete_one({
            "_id": ObjectId(session_id),
            "user_id": current_user["id"]
        })
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid session ID")
        
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return {"message": "Session deleted successfully"}
