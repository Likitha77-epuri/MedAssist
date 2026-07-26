import os
import pymongo
from dotenv import load_dotenv

# Load env variables
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "mediassist_db")

print(f"Connecting to MongoDB: {MONGODB_URL}")
print(f"Target Database: {DATABASE_NAME}")

client = pymongo.MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]

diseases_data = [
    {
        "name": "Common Cold",
        "description": "A viral infection of your nose and throat (upper respiratory tract). It's usually harmless, though it might not feel that way.",
        "causes": ["Rhinovirus (most common)", "Coronavirus", "Respiratory syncytial virus (RSV)"],
        "symptoms": ["Runny or stuffy nose", "Sore throat", "Cough", "Congestion", "Slight body aches", "Mild headache", "Sneezing", "Low-grade fever"],
        "risk_factors": ["Age (young children are more susceptible)", "Weakened immune system", "Time of year (fall and winter)", "Smoking", "Exposure in crowded spaces"],
        "prevention": ["Wash your hands frequently", "Disinfect items", "Use tissues", "Don't share cups or utensils", "Avoid close contact with anyone who has a cold"],
        "treatment": ["Rest", "Hydration (water, warm broths)", "Saltwater gargle", "Over-the-counter nasal decongestants", "Pain relievers like acetaminophen or ibuprofen"],
        "lifestyle_tips": ["Keep your room warm and humidified", "Sip warm liquids", "Avoid smoke and alcohol"]
    },
    {
        "name": "Influenza (Flu)",
        "description": "A common viral infection that attacks your lungs, nose, and throat. It can be severe, especially in high-risk individuals.",
        "causes": ["Influenza Virus Type A", "Influenza Virus Type B", "Influenza Virus Type C"],
        "symptoms": ["High fever (usually over 101°F/38.3°C)", "Aching muscles, especially in your back, arms, and legs", "Chills and sweats", "Headache", "Dry, persistent cough", "Fatigue and weakness", "Nasal congestion", "Sore throat"],
        "risk_factors": ["Age (young children and older adults)", "Chronic illnesses (asthma, heart disease, diabetes)", "Weakened immune system", "Pregnancy", "Obesity"],
        "prevention": ["Annual flu vaccine", "Thorough hand washing", "Avoid touching eyes, nose, and mouth", "Avoid crowds during peak flu season"],
        "treatment": ["Rest", "Fluid intake", "Antiviral drugs (like oseltamivir/Tamiflu, if prescribed within 48 hours)", "Pain and fever reducers"],
        "lifestyle_tips": ["Stay home from work or school to prevent spread", "Eat light, easily digestible nutritious foods", "Use steam inhalation for congestion"]
    },
    {
        "name": "Strep Throat",
        "description": "A bacterial infection that causes a sore, scratchy throat. Unlike a viral throat infection, strep throat requires antibiotic treatment.",
        "causes": ["Streptococcus pyogenes bacteria (Group A streptococcus)"],
        "symptoms": ["Sudden, severe throat pain", "Pain when swallowing", "Fever", "Red and swollen tonsils, sometimes with white patches", "Tiny red spots on the roof of the mouth", "Swollen lymph nodes in the neck", "Headache"],
        "risk_factors": ["School-age children and teens", "Time of year (late fall, winter, early spring)", "Close contact with infected individuals"],
        "prevention": ["Wash hands frequently", "Cover mouth when coughing/sneezing", "Avoid sharing personal items", "Isolate infected household members"],
        "treatment": ["Prescription oral antibiotics (Penicillin or Amoxicillin)", "Pain relief medications", "Throat lozenges"],
        "lifestyle_tips": ["Get plenty of sleep", "Drink warm broths or cold liquids to soothe throat", "Gargle with warm salt water several times a day"]
    },
    {
        "name": "Gastroenteritis (Stomach Flu)",
        "description": "An intestinal infection marked by watery diarrhea, abdominal cramps, nausea or vomiting, and sometimes fever.",
        "causes": ["Norovirus", "Rotavirus", "Foodborne bacteria (Salmonella, E. coli)", "Contaminated water"],
        "symptoms": ["Watery, non-bloody diarrhea", "Abdominal cramps and pain", "Nausea, vomiting, or both", "Occasional muscle aches or headache", "Low-grade fever"],
        "risk_factors": ["Young children in child care centers", "Older adults in nursing homes", "Individuals with compromised immune systems", "Unhygienic food handling"],
        "prevention": ["Wash hands thoroughly", "Disinfect hard surfaces", "Avoid contaminated food and water", "Vaccination (Rotavirus vaccine for infants)"],
        "treatment": ["Oral rehydration solutions (ORS) to prevent dehydration", "Gradual reintroduction of bland foods", "Avoid dairy, caffeine, and fatty foods", "Avoid anti-diarrheal medicines unless advised by a doctor"],
        "lifestyle_tips": ["Sip small amounts of water or suck on ice chips", "Rest in bed", "Use the BRAT diet (Bananas, Rice, Applesauce, Toast) once vomiting stops"]
    },
    {
        "name": "Diabetes Mellitus",
        "description": "A chronic medical condition where the body cannot produce enough insulin or cannot effectively use the insulin it produces, leading to elevated blood glucose.",
        "causes": ["Type 1: Autoimmune destruction of beta cells in pancreas", "Type 2: Insulin resistance and lifestyle factors (obesity, physical inactivity)"],
        "symptoms": ["Increased thirst (polydipsia)", "Frequent urination (polyuria)", "Extreme hunger", "Unexplained weight loss", "Fatigue", "Irritability", "Blurry vision", "Slow-healing sores"],
        "risk_factors": ["Family history / Genetics", "Overweight/Obesity", "Physical inactivity", "Age (risk of Type 2 increases after age 45)", "High blood pressure", "Gestational diabetes history"],
        "prevention": ["Maintain a healthy weight", "Be physically active (at least 150 minutes of moderate exercise per week)", "Eat a diet rich in fiber, whole grains, and lean protein", "Limit sugar and refined carbohydrates"],
        "treatment": ["Insulin therapy (Type 1 & some Type 2)", "Oral medications (Metformin, Sulfonylureas)", "Blood sugar monitoring", "Healthy diet and exercise plan"],
        "lifestyle_tips": ["Monitor blood sugar levels regularly", "Inspect feet daily for cuts or sores", "Schedule regular eye and kidney checkups", "Carry emergency fast-acting glucose"]
    },
    {
        "name": "Hypertension (High Blood Pressure)",
        "description": "A common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems, such as heart disease.",
        "causes": ["Primary: No identifiable cause (develops gradually over years)", "Secondary: Kidney disease, thyroid problems, medications, or congenital heart defects"],
        "symptoms": ["Most people have NO symptoms (\"silent killer\")", "Severe headache (in hypertensive crisis)", "Shortness of breath", "Nosebleeds", "Dizziness", "Chest pain"],
        "risk_factors": ["Age (increases with age)", "Race (more common in black adults)", "Family history", "Overweight or obesity", "Tobacco use", "Too much salt and too little potassium in diet", "High stress levels"],
        "prevention": ["Eat a low-sodium, heart-healthy diet (DASH diet)", "Exercise regularly", "Maintain a healthy weight", "Limit alcohol", "Manage stress"],
        "treatment": ["Lifestyle changes", "Medications (ACE inhibitors, Beta-blockers, Diuretics, Calcium channel blockers)"],
        "lifestyle_tips": ["Monitor blood pressure at home", "Reduce sodium intake to under 2,300 mg per day", "Avoid second-hand smoke", "Adopt deep breathing or meditation practices"]
    }
]

medicines_data = [
    {
        "name": "Acetaminophen",
        "uses": ["Pain relief (mild to moderate headaches, muscle aches, arthritis, toothaches)", "Fever reduction"],
        "dosage": "Adults: 325 mg to 650 mg every 4 to 6 hours as needed. Do not exceed 4,000 mg (4 grams) in 24 hours.",
        "side_effects": ["Liver damage (if taken in high doses)", "Nausea", "Allergic reaction (rash, swelling)"],
        "precautions": ["Avoid alcohol while taking this medicine due to liver strain", "Check other medication labels (cough/cold meds) to ensure they do not also contain acetaminophen"],
        "interactions": ["Warfarin (increased bleeding risk)", "Alcohol (severe liver damage risk)", "Other acetaminophen-containing products"],
        "storage": "Store at room temperature (59°F to 86°F / 15°C to 30°C) away from heat, moisture, and light. Keep out of reach of children."
    },
    {
        "name": "Ibuprofen",
        "uses": ["Anti-inflammatory pain relief (headaches, menstrual cramps, dental pain, arthritis, sprains)", "Fever reduction"],
        "dosage": "Adults: 200 mg to 400 mg every 4 to 6 hours as needed. Maximum daily dose is 3,200 mg (under doctor supervision) or 1,200 mg for self-treatment.",
        "side_effects": ["Stomach upset, heartburn, or pain", "Dizziness or headache", "Ringing in ears", "Increased risk of stomach ulcers or bleeding"],
        "precautions": ["Take with food or milk to prevent stomach irritation", "Avoid if you have a history of stomach ulcers, kidney disease, or heart disease", "Do not take in late pregnancy"],
        "interactions": ["Aspirin or other NSAIDs (increased ulcer risk)", "Blood thinners (warfarin, clopidogrel)", "Blood pressure medications (decreased efficacy)"],
        "storage": "Store in a dry place at room temperature. Avoid excessive heat."
    },
    {
        "name": "Amoxicillin",
        "uses": ["Treatment of bacterial infections (strep throat, middle ear infections, tonsillitis, pneumonia, UTIs)"],
        "dosage": "Usually 250 mg to 500 mg every 8 hours, or 500 mg to 875 mg every 12 hours. Always complete the entire course prescribed.",
        "side_effects": ["Diarrhea", "Nausea or vomiting", "Skin rash (seek doctor advice if it develops)", "Yeast infection"],
        "precautions": ["Do not take if allergic to penicillin or cephalosporins", "Complete the full course even if symptoms disappear early to prevent antibiotic resistance"],
        "interactions": ["Oral contraceptives (may reduce effectiveness)", "Allopurinol (increased risk of rash)", "Methotrexate (increased drug toxicity)"],
        "storage": "Store capsules at room temperature. Liquid suspensions should preferably be refrigerated and discarded after 14 days."
    },
    {
        "name": "Metformin",
        "uses": ["Type 2 Diabetes mellitus management (improves insulin sensitivity and reduces glucose production in liver)"],
        "dosage": "Initially 500 mg once or twice daily, taken with meals. May be adjusted gradually up to a maximum of 2,550 mg daily.",
        "side_effects": ["Nausea, vomiting, gas, or bloating", "Diarrhea (tends to improve over time)", "Metallic taste in mouth", "Lactic acidosis (rare but severe)"],
        "precautions": ["Monitor kidney function regularly", "Discontinue temporarily before any contrast dye scans", "Limit alcohol intake"],
        "interactions": ["Contrast dye (kidney failure risk)", "Alcohol (increased risk of lactic acidosis)", "Diuretics or steroids (may elevate blood sugar)"],
        "storage": "Store at room temperature in a tightly closed container away from moisture."
    },
    {
        "name": "Lisinopril",
        "uses": ["Treatment of high blood pressure (hypertension)", "Heart failure management", "Improving survival after heart attacks"],
        "dosage": "Standard starting dose is 10 mg once daily. Maintenance dose ranges from 10 mg to 40 mg once daily.",
        "side_effects": ["Dry cough (very common with ACE inhibitors)", "Dizziness or lightheadedness", "Increased potassium levels in blood", "Headache"],
        "precautions": ["Do not use during pregnancy (can cause fetal harm)", "Report any swelling of face, lips, or tongue immediately (angioedema)", "Stand up slowly to avoid dizzy spells"],
        "interactions": ["Potassium supplements (dangerous hyperkalemia risk)", "NSAIDs like ibuprofen (reduced BP control, kidney risk)", "Lithium (increased toxic lithium levels)"],
        "storage": "Store at room temperature away from direct light and moisture."
    }
]

# Insert diseases
diseases_col = db["diseases"]
for disease in diseases_data:
    if not diseases_col.find_one({"name": disease["name"]}):
        diseases_col.insert_one(disease)
        print(f"Seeded disease: {disease['name']}")
    else:
        print(f"Disease already exists: {disease['name']}")

# Insert medicines
medicines_col = db["medicines"]
for med in medicines_data:
    if not medicines_col.find_one({"name": med["name"]}):
        medicines_col.insert_one(med)
        print(f"Seeded medicine: {med['name']}")
    else:
        print(f"Medicine already exists: {med['name']}")

print("Database seeding completed successfully!")
client.close()
