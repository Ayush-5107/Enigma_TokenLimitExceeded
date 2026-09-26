from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User
from backend.app.schemas.schemas import EstateCaseCreate, EstateCaseResponse
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event
from backend.app.services.estate_service import estate_service

router = APIRouter(prefix="/estate", tags=["estate"])

@router.post("", response_model=EstateCaseResponse)
def create_estate(case_in: EstateCaseCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    estate = estate_service.create_estate(db, case_in, current_user)
    log_audit_event(db, current_user, "CREATE_ESTATE", f"Created new estate case for '{estate.deceased_name}'", estate_id=estate.id)
    return estate

@router.get("/{estate_id}", response_model=EstateCaseResponse)
def get_estate(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    estate = estate_service.get_estate(db, estate_id)
    if not estate:
        raise HTTPException(status_code=404, detail="Estate case not found")
    return estate

@router.get("/{estate_id}/summary")
def get_estate_summary(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    estate = estate_service.get_estate(db, estate_id)
    if not estate:
        return {
            "estate_id": estate_id,
            "title": "Family Financial Closure Case",
            "deceased_name": "Deceased Family Member",
            "total_asset_value": 0.0,
            "total_liability_value": 0.0,
            "net_estate_value": 0.0,
            "unconfirmed_items_count": 0,
            "pending_actions_count": 0,
            "completed_actions_count": 0,
            "total_actions_count": 0,
            "closure_progress_percent": 0
        }
    return estate_service.get_estate_summary(db, estate)
