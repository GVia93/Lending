from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# --- Models ---

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    icon: str
    base_price: float
    price_per_sqm: float
    image_url: str

class PriceConfig(BaseModel):
    model_config = ConfigDict(extra="ignore")
    service_slug: str
    base_price: float
    price_per_sqm: float
    height_multipliers: dict
    options: List[dict]

class CalculateRequest(BaseModel):
    service_slug: str
    area: float
    height: float
    options: List[str] = []

class CalculateResponse(BaseModel):
    base_cost: float
    area_cost: float
    height_cost: float
    options_cost: float
    total: float
    breakdown: List[dict]

class ContactRequest(BaseModel):
    name: str
    phone: str
    service_type: str
    message: Optional[str] = ""

class ContactResponse(BaseModel):
    id: str
    status: str

class PortfolioItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    category: str
    image_url: str
    area: str
    duration: str

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    role: str
    company: str
    text: str
    rating: int

# --- Seed Data ---

SERVICES = [
    {
        "id": "svc-1",
        "name": "Строительство ангаров",
        "slug": "hangars",
        "description": "Проектирование и строительство металлических ангаров любой сложности. Арочные, прямостенные, каркасные конструкции.",
        "icon": "Warehouse",
        "base_price": 500000,
        "price_per_sqm": 8500,
        "image_url": "https://images.unsplash.com/photo-1637166247109-f231767074b3?w=800&q=80"
    },
    {
        "id": "svc-2",
        "name": "Зернохранилища",
        "slug": "grain-storage",
        "description": "Строительство современных зернохранилищ с системами вентиляции и контроля температуры.",
        "icon": "Wheat",
        "base_price": 700000,
        "price_per_sqm": 11000,
        "image_url": "https://images.unsplash.com/photo-1764875471713-1fa99cc3d3e2?w=800&q=80"
    },
    {
        "id": "svc-3",
        "name": "Промышленные гаражи",
        "slug": "garages",
        "description": "Возведение промышленных гаражей и боксов для хранения техники и транспорта.",
        "icon": "Container",
        "base_price": 350000,
        "price_per_sqm": 7000,
        "image_url": "https://images.unsplash.com/photo-1760921678729-9658c8b792bb?w=800&q=80"
    },
    {
        "id": "svc-4",
        "name": "Демонтаж сооружений",
        "slug": "demolition",
        "description": "Профессиональный демонтаж зданий и сооружений с вывозом строительного мусора.",
        "icon": "Hammer",
        "base_price": 150000,
        "price_per_sqm": 3500,
        "image_url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
    }
]

PRICE_CONFIGS = {
    "hangars": {
        "service_slug": "hangars",
        "base_price": 500000,
        "price_per_sqm": 8500,
        "height_multipliers": {"6": 1.0, "8": 1.15, "10": 1.3, "12": 1.5},
        "options": [
            {"id": "insulation", "name": "Утепление", "price": 1500, "unit": "за м²"},
            {"id": "gates", "name": "Ворота (секционные)", "price": 85000, "unit": "за шт."},
            {"id": "ventilation", "name": "Вентиляция", "price": 120000, "unit": "комплект"},
            {"id": "lighting", "name": "Освещение", "price": 65000, "unit": "комплект"},
            {"id": "fire-system", "name": "Пожарная сигнализация", "price": 95000, "unit": "комплект"}
        ]
    },
    "grain-storage": {
        "service_slug": "grain-storage",
        "base_price": 700000,
        "price_per_sqm": 11000,
        "height_multipliers": {"8": 1.0, "10": 1.15, "12": 1.3, "15": 1.5},
        "options": [
            {"id": "ventilation", "name": "Система вентиляции", "price": 250000, "unit": "комплект"},
            {"id": "temperature", "name": "Контроль температуры", "price": 180000, "unit": "комплект"},
            {"id": "loading", "name": "Погрузочная система", "price": 350000, "unit": "комплект"},
            {"id": "insulation", "name": "Утепление", "price": 2000, "unit": "за м²"},
            {"id": "gates", "name": "Ворота", "price": 95000, "unit": "за шт."}
        ]
    },
    "garages": {
        "service_slug": "garages",
        "base_price": 350000,
        "price_per_sqm": 7000,
        "height_multipliers": {"4": 1.0, "5": 1.1, "6": 1.2, "8": 1.4},
        "options": [
            {"id": "insulation", "name": "Утепление", "price": 1200, "unit": "за м²"},
            {"id": "gates", "name": "Ворота (секционные)", "price": 75000, "unit": "за шт."},
            {"id": "pit", "name": "Смотровая яма", "price": 120000, "unit": "за шт."},
            {"id": "lighting", "name": "Освещение", "price": 45000, "unit": "комплект"},
            {"id": "heating", "name": "Отопление", "price": 150000, "unit": "комплект"}
        ]
    },
    "demolition": {
        "service_slug": "demolition",
        "base_price": 150000,
        "price_per_sqm": 3500,
        "height_multipliers": {"5": 1.0, "8": 1.2, "10": 1.4, "15": 1.7},
        "options": [
            {"id": "debris-removal", "name": "Вывоз мусора", "price": 800, "unit": "за м²"},
            {"id": "recycling", "name": "Переработка материалов", "price": 500, "unit": "за м²"},
            {"id": "site-clearing", "name": "Расчистка территории", "price": 1200, "unit": "за м²"},
            {"id": "documentation", "name": "Оформление документов", "price": 50000, "unit": "комплект"}
        ]
    }
}

PORTFOLIO = [
    {
        "id": "p-1",
        "title": "Ангар для хранения техники",
        "description": "Строительство арочного ангара 1200 м² для агрохолдинга",
        "category": "hangars",
        "image_url": "https://images.unsplash.com/photo-1637166247109-f231767074b3?w=800&q=80",
        "area": "1200 м²",
        "duration": "45 дней"
    },
    {
        "id": "p-2",
        "title": "Зернохранилище на 5000 тонн",
        "description": "Современное зернохранилище с системой климат-контроля",
        "category": "grain-storage",
        "image_url": "https://images.unsplash.com/photo-1764875471713-1fa99cc3d3e2?w=800&q=80",
        "area": "2500 м²",
        "duration": "60 дней"
    },
    {
        "id": "p-3",
        "title": "Промышленный гараж на 10 боксов",
        "description": "Гаражный комплекс для грузовой техники",
        "category": "garages",
        "image_url": "https://images.unsplash.com/photo-1760921678729-9658c8b792bb?w=800&q=80",
        "area": "800 м²",
        "duration": "30 дней"
    },
    {
        "id": "p-4",
        "title": "Складской ангар",
        "description": "Прямостенный ангар для логистической компании",
        "category": "hangars",
        "image_url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        "area": "3000 м²",
        "duration": "75 дней"
    },
    {
        "id": "p-5",
        "title": "Демонтаж цеха",
        "description": "Демонтаж старого производственного цеха с вывозом мусора",
        "category": "demolition",
        "image_url": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
        "area": "1500 м²",
        "duration": "20 дней"
    },
    {
        "id": "p-6",
        "title": "Зернохранилище модульное",
        "description": "Модульное зернохранилище для фермерского хозяйства",
        "category": "grain-storage",
        "image_url": "https://images.unsplash.com/photo-1763067028991-063a260d3b66?w=800&q=80",
        "area": "1800 м²",
        "duration": "50 дней"
    }
]

TESTIMONIALS = [
    {
        "id": "t-1",
        "name": "Алексей Петров",
        "role": "Директор",
        "company": "АгроХолдинг «Нива»",
        "text": "М-СТРОЙ построили нам ангар за 45 дней. Качество металлоконструкций на высоте, всё сделано точно по проекту. Рекомендуем!",
        "rating": 5
    },
    {
        "id": "t-2",
        "name": "Игорь Сидоров",
        "role": "Управляющий",
        "company": "ТК «ЛогистикПро»",
        "text": "Заказывали строительство складского комплекса. Ребята работали оперативно, уложились в сроки. Цены адекватные, качество отличное.",
        "rating": 5
    },
    {
        "id": "t-3",
        "name": "Марина Козлова",
        "role": "Владелец",
        "company": "Фермерское хозяйство «Заря»",
        "text": "Зернохранилище получилось отличное. Система вентиляции работает исправно, зерно хранится в идеальных условиях.",
        "rating": 5
    },
    {
        "id": "t-4",
        "name": "Дмитрий Волков",
        "role": "Главный инженер",
        "company": "ООО «СтройБаза»",
        "text": "Демонтаж старого цеха прошёл быстро и чисто. Площадку оставили в идеальном состоянии. Профессионалы своего дела.",
        "rating": 4
    }
]

# --- Endpoints ---

@api_router.get("/")
async def root():
    return {"message": "М-СТРОЙ API"}

@api_router.get("/services")
async def get_services():
    return SERVICES

@api_router.get("/prices")
async def get_prices():
    return PRICE_CONFIGS

@api_router.get("/prices/{service_slug}")
async def get_price_config(service_slug: str):
    if service_slug in PRICE_CONFIGS:
        return PRICE_CONFIGS[service_slug]
    return {"error": "Service not found"}

@api_router.post("/calculate", response_model=CalculateResponse)
async def calculate_cost(req: CalculateRequest):
    config = PRICE_CONFIGS.get(req.service_slug)
    if not config:
        return CalculateResponse(base_cost=0, area_cost=0, height_cost=0, options_cost=0, total=0, breakdown=[])

    base_cost = config["base_price"]
    area_cost = req.area * config["price_per_sqm"]

    height_str = str(int(req.height))
    height_mult = 1.0
    for h, m in config["height_multipliers"].items():
        if int(h) <= int(req.height):
            height_mult = m
    height_cost = area_cost * (height_mult - 1.0)

    options_cost = 0.0
    breakdown = [
        {"name": "Базовая стоимость", "value": base_cost},
        {"name": f"Площадь ({req.area} м²)", "value": area_cost},
        {"name": f"Высота ({req.height} м, x{height_mult})", "value": height_cost},
    ]

    for opt_id in req.options:
        for opt in config["options"]:
            if opt["id"] == opt_id:
                if opt["unit"] == "за м²":
                    opt_cost = opt["price"] * req.area
                else:
                    opt_cost = opt["price"]
                options_cost += opt_cost
                breakdown.append({"name": opt["name"], "value": opt_cost})

    total = base_cost + area_cost + height_cost + options_cost

    return CalculateResponse(
        base_cost=base_cost,
        area_cost=area_cost,
        height_cost=height_cost,
        options_cost=options_cost,
        total=total,
        breakdown=breakdown
    )

@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(req: ContactRequest):
    contact_id = str(uuid.uuid4())
    doc = {
        "id": contact_id,
        "name": req.name,
        "phone": req.phone,
        "service_type": req.service_type,
        "message": req.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "new"
    }
    await db.contacts.insert_one(doc)
    return ContactResponse(id=contact_id, status="success")

@api_router.get("/portfolio")
async def get_portfolio():
    return PORTFOLIO

@api_router.get("/testimonials")
async def get_testimonials():
    return TESTIMONIALS

# Include router and middleware
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
