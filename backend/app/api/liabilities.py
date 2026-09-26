from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, Liability
from backend.app.schemas.schemas import LiabilityCreate, LiabilityResponse
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event
from backend.app.services.action_engine import ActionEngine

router = APIRouter(prefix="", tags=["liabilities"])

@router.get("/estate/{estate_id}/liabilities", response_model=List[LiabilityResponse])
def list_liabilities(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Liability).filter(Liability.estate_id == estate_id).all()

@router.post("/estate/{estate_id}/liabilities", response_model=LiabilityResponse)
def create_liability(estate_id: str, liab_in: LiabilityCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    liability = Liability(
        estate_id=estate_id,
        category=liab_in.category,
        name=liab_in.name,
        creditor=liab_in.creditor,
        total_amount=liab_in.total_amount,
        emi_amount=liab_in.emi_amount,
        due_date=liab_in.due_date,
        is_confirmed=True,
        confidence_score=1.0,
        status="confirmed",
        details_json=liab_in.details_json or {},
        confirmed_by_id=current_user.id
    )
    db.add(liability)
    db.commit()
    db.refresh(liability)
    
    ActionEngine.generate_actions_for_liability(db, estate_id, liability)
    log_audit_event(db, current_user, "CREATE_LIABILITY", f"Added confirmed liability '{liability.name}' (${liability.total_amount:,.2f})", estate_id=estate_id)
    return liability

@router.put("/estate/{estate_id}/liabilities/{liability_id}", response_model=LiabilityResponse)
def update_liability(estate_id: str, liability_id: str, liab_in: LiabilityCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    liability = db.query(Liability).filter(Liability.id == liability_id, Liability.estate_id == estate_id).first()
    if not liability:
        raise HTTPException(status_code=404, detail="Liability not found")
        
    liability.name = liab_in.name
    liability.category = liab_in.category
    liability.creditor = liab_in.creditor
    liability.total_amount = liab_in.total_amount
    liability.emi_amount = liab_in.emi_amount
    liability.due_date = liab_in.due_date
    if liab_in.details_json:
        liability.details_json = liab_in.details_json
    liability.is_confirmed = True
    liability.status = "confirmed"
    db.commit()
    db.refresh(liability)
    log_audit_event(db, current_user, "UPDATE_LIABILITY", f"Updated liability '{liability.name}'", estate_id=estate_id)
    return liability
