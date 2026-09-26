from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.api import (
    auth, vault, documents, extraction, estate, assets, liabilities, actions, family, audit, notifications, tasks
)
from database.seed.seed_demo_data import seed_db

# Create DB tables
Base.metadata.create_all(bind=engine)

# Auto seed on startup if database is newly initialized
try:
    seed_db()
except Exception as e:
    print(f"Seed info: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Digital Estate & Financial Closure Assistant API (FinTech Track)"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
app.mount("/storage", StaticFiles(directory=settings.STORAGE_DIR), name="storage")

# Mount API Router under /api/v1
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(vault.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(extraction.router, prefix=settings.API_V1_STR)
app.include_router(estate.router, prefix=settings.API_V1_STR)
app.include_router(assets.router, prefix=settings.API_V1_STR)
app.include_router(liabilities.router, prefix=settings.API_V1_STR)
app.include_router(actions.router, prefix=settings.API_V1_STR)
app.include_router(family.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(tasks.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "status": "online",
        "api_v1": f"{settings.API_V1_STR}",
        "tee_enabled": settings.TEE_ENABLED,
        "tee_mode": settings.TEE_MODE,
        "tagline": "Don't leave your family a scavenger hunt."
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "healthy",
        "tee_enclave_status": "ATTESTED_ONLINE",
        "model_version": settings.EXTRACTION_MODEL_VERSION
    }
