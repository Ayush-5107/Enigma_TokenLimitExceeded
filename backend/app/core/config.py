import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "Digital Estate & Financial Closure Assistant"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "enigma-digital-estate-super-secret-jwt-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./digital_estate.db")
    
    # Storage & Security
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "secret-estate-vault-encryption-key-32b")
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./storage")
    
    # TEE Configuration
    TEE_ENABLED: bool = os.getenv("TEE_ENABLED", "true").lower() == "true"
    TEE_MODE: str = os.getenv("TEE_MODE", "development") # development / production_attested
    EXTRACTION_MODEL_VERSION: str = "v1.4.0-custom-fintech"

settings = Settings()

os.makedirs(settings.STORAGE_DIR, exist_ok=True)
