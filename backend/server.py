from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# --- Models ---------------------------------------------------------------

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class RefineRequest(BaseModel):
    product_name: str
    additional_notes: Optional[str] = ""
    filled_specs: Dict[str, Any] = Field(default_factory=dict)
    isq_specs: List[str] = Field(default_factory=list)
    free_text_specs: List[str] = Field(default_factory=list)
    quantity: Optional[int] = 0


# --- Routes ----------------------------------------------------------------

@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        if isinstance(r['timestamp'], str):
            r['timestamp'] = datetime.fromisoformat(r['timestamp'])
    return rows


@api_router.post("/ai/refine-questions")
async def refine_questions(req: RefineRequest):
    """Generate dynamic B2B buyer-requirement questions via Gemini."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    qty = req.quantity or 0
    business_signal = "HIGH" if qty >= 50 else ("MEDIUM" if qty >= 10 else "LOW")

    prompt = f"""You are an IndiaMART B2B procurement system helping buyers specify requirements.

INPUT:
PRODUCT NAME: "{req.product_name}"
BUYER NOTES: "{req.additional_notes or ''}"
FILLED SPECS: {json.dumps(req.filled_specs)}
ISQ SPECS: {json.dumps(req.isq_specs)}
FREE-TEXT SPECS: {json.dumps(req.free_text_specs)}
QUANTITY: {qty} (business signal: {business_signal})

STEP 1 — EXTRACT KNOWN SPECS (no inference, max 3).

STEP 2 — SUGGEST PRODUCT SPECS (max 4)
Important product specs NOT already in FILLED SPECS or ISQ SPECS.
Rules: chip-style with 5-10 real Indian B2B values, no Yes/No specs, no trivial specs.
Focus on specs that genuinely help shortlist the right seller (delivery timeline, MOQ, after-sales support, warranty, certification, finish/grade etc — choose what matters most for THIS product).

STEP 3 — SUGGEST PERSONA QUESTIONS (max 3)
Probe the BUYER PROFILE so the seller can quote accurately. ONLY include if business_signal is MEDIUM or HIGH OR the product is a B2B / capital-goods item.
Examples:
- Industry / Sector (chip with realistic Indian sectors)
- Company Size / Employee Count (chip)
- Buyer Role (chip: Owner, Procurement Manager, Engineer, Reseller, …)
- End-Use / Project Type
- Company Name (text, only if signal=HIGH)
- Procurement Frequency (chip: One-time, Monthly, Quarterly, Annual)
Skip persona Qs entirely if signal=LOW and product is consumer-grade.

Return JSON ONLY in this exact shape (no markdown, no preamble):
{{
  "extracted": {{ "<spec>": "<value>" }},
  "suggested": [
    {{"name": "<spec>", "hint": "<2-4 words>", "options": ["..."], "type": "chip|text"}}
  ],
  "persona": [
    {{"name": "<question>", "hint": "<2-4 words>", "options": ["..."], "type": "chip|text"}}
  ]
}}
"""

    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        chat = LlmChat(
            api_key=api_key,
            session_id=f"refine-{uuid.uuid4().hex[:8]}",
            system_message="You are a B2B procurement AI. Return ONLY valid JSON.",
        ).with_model("gemini", "gemini-2.5-flash-lite")

        raw = await chat.send_message(UserMessage(text=prompt))
        text = raw.strip() if isinstance(raw, str) else str(raw)
        # strip code fences if present
        if text.startswith("```"):
            text = text.split("```", 2)[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip().rstrip("`").strip()
        data = json.loads(text)
        return data
    except json.JSONDecodeError as e:
        logger.warning(f"Gemini returned non-JSON: {e}; falling back")
        return _fallback_questions(req)
    except Exception as e:
        logger.exception(f"Gemini call failed: {e}")
        return _fallback_questions(req)


def _fallback_questions(req: RefineRequest) -> Dict[str, Any]:
    """Deterministic keyword-based fallback so UI never breaks."""
    p = req.product_name.lower()
    qty = req.quantity or 0
    if any(k in p for k in ["generator", "diesel"]):
        suggested = [
            {"name": "Power Rating", "hint": "kVA range", "options": ["25 kVA", "62.5 kVA", "100 kVA", "125 kVA", "200 kVA", "320 kVA"], "type": "chip"},
            {"name": "Application", "hint": "use case", "options": ["Industrial", "Commercial", "Residential", "Construction", "Telecom"], "type": "chip"},
            {"name": "Warranty", "hint": "years", "options": ["1 Year", "2 Years", "3 Years", "5 Years"], "type": "chip"},
            {"name": "Delivery Timeline", "hint": "lead time", "options": ["Within 1 Week", "2-3 Weeks", "1 Month", "Flexible"], "type": "chip"},
        ]
    elif any(k in p for k in ["helmet", "safety", "ppe"]):
        suggested = [
            {"name": "Certification", "hint": "standard", "options": ["IS 2925", "CE", "ANSI Z89.1", "ISO 3873"], "type": "chip"},
            {"name": "Color", "hint": "shade", "options": ["White", "Yellow", "Red", "Blue", "Orange"], "type": "chip"},
            {"name": "MOQ", "hint": "min order", "options": ["50 Pcs", "100 Pcs", "500 Pcs", "1000 Pcs"], "type": "chip"},
            {"name": "Branding", "hint": "logo print", "options": ["Plain", "Logo Required", "Custom Print"], "type": "chip"},
        ]
    elif any(k in p for k in ["tile", "tiles", "wall", "floor"]):
        suggested = [
            {"name": "Size", "hint": "dimensions", "options": ["300x300 mm", "600x600 mm", "800x800 mm", "1200x600 mm"], "type": "chip"},
            {"name": "Finish", "hint": "surface", "options": ["Matte", "Glossy", "Satin", "Polished"], "type": "chip"},
            {"name": "Application Area", "hint": "where used", "options": ["Bathroom", "Kitchen", "Living Room", "Outdoor"], "type": "chip"},
            {"name": "Project Stage", "hint": "timeline", "options": ["Quoting", "Within 2 Weeks", "Within 1 Month", "Exploring"], "type": "chip"},
        ]
    elif any(k in p for k in ["conveyor", "belt"]):
        suggested = [
            {"name": "Width", "hint": "belt width", "options": ["400 mm", "600 mm", "800 mm", "1000 mm"], "type": "chip"},
            {"name": "Belt Type", "hint": "style", "options": ["Flat", "Modular", "Roller", "Cleated"], "type": "chip"},
            {"name": "Load Capacity", "hint": "kg/hr", "options": ["<500", "500-2000", "2000+"], "type": "chip"},
        ]
    else:
        suggested = [
            {"name": "Quality Grade", "hint": "tier", "options": ["Premium", "Standard", "Economy"], "type": "chip"},
            {"name": "Delivery Timeline", "hint": "lead time", "options": ["Within 1 Week", "1-2 Weeks", "2-4 Weeks", "1+ Month"], "type": "chip"},
            {"name": "MOQ", "hint": "min order", "options": ["10", "50", "100", "500"], "type": "chip"},
            {"name": "Payment Terms", "hint": "mode", "options": ["Advance", "30 Day Credit", "LC", "On Delivery"], "type": "chip"},
        ]

    persona = []
    if qty >= 10 or any(k in p for k in ["generator", "conveyor", "belt", "tiles", "compressor", "pump", "industrial"]):
        persona = [
            {"name": "Industry", "hint": "your sector", "options": ["Manufacturing", "Construction", "Healthcare", "IT/ITES", "Hospitality", "Retail", "Logistics"], "type": "chip"},
            {"name": "Company Size", "hint": "employees", "options": ["<10", "10-50", "50-200", "200-1000", "1000+"], "type": "chip"},
            {"name": "Your Role", "hint": "designation", "options": ["Owner", "Procurement Manager", "Engineer", "Purchase Executive", "Reseller"], "type": "chip"},
        ]
        if qty >= 50:
            persona.append({"name": "Company Name", "hint": "for invoice", "options": [], "type": "text"})

    return {
        "extracted": {},
        "suggested": suggested,
        "persona": persona,
    }


# Mount & middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
