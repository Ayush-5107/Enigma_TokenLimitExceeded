from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User
from backend.app.schemas.schemas import AuditEventResponse
from backend.app.security.auth import get_current_user
from backend.app.services.audit_service import audit_service

router = APIRouter(prefix="", tags=["audit"])

@router.get("/estate/{estate_id}/audit", response_model=List[AuditEventResponse])
def get_estate_audit_trail(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return audit_service.get_estate_audit_trail(db, estate_id)
