from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import companies, health, items, snowflake

settings = get_settings()

app = FastAPI(title="Hackathon API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(items.router)
app.include_router(snowflake.router)
app.include_router(companies.router)


@app.get("/")
async def root():
    return {"name": "Hackathon API", "docs": "/docs", "health": "/api/health"}
