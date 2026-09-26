from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, EstateCase, Asset, Liability, ActionItem, Document, EstateMember
from backend.app.schemas.schemas import EstateCaseCreate, EstateCaseResponse
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event

router = APIRouter(prefix="/estate", tags=["estate"])

@router.post("", response_model=EstateCaseResponse)
def create_estate(case_in: EstateCaseCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    estate = EstateCase(
        title=case_in.title,
        deceased_name=case_in.deceased_name,
        date_of_passing=case_in.date_of_passing,
        primary_owner_id=current_user.id
    )
    db.add(estate)
    db.commit()
    db.refresh(estate)
    
    # Auto add owner as primary member
    owner_member = EstateMember(
        estate_id=estate.id,
        user_id=current_user.id,
        name=current_user.full_name,
        email=current_user.email,
        relationship_type="Owner / Executor",
        role="owner",
        permissions_json={"vault": True, "documents": True, "estate": True, "actions": True, "audit": True},
        status="active"
    )
    db.add(owner_member)
    db.commit()
    
    log_audit_event(db, current_user, "CREATE_ESTATE", f"Created new estate case for '{estate.deceased_name}'", estate_id=estate.id)
    return estate

@router.get("/{estate_id}", response_model=EstateCaseResponse)
def get_estate(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    estate = db.query(EstateCase).filter(EstateCase.id == estate_id).first()
    if not estate:
        raise HTTPException(status_code=404, detail="Estate case not found")
    return estate

@router.get("/{estate_id}/summary")
def get_estate_summary(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    estate = db.query(EstateCase).filter(EstateCase.id == estate_id).first()
    if not estate:
        # Default mock summary if fresh estate
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
            "closure_progress_percent": 0
        }

    assets = db.query(Asset).filter(Asset.estate_id == estate_id).all()
    liabilities = db.query(Liability).filter(Liability.estate_id == estate_id).all()
    actions = db.query(ActionItem).filter(ActionItem.estate_id == estate_id).all()
    
    total_assets = sum(a.estimated_value for a in assets)
    total_liabilities = sum(l.total_amount for l in liabilities)
    unconfirmed = len([a for a in assets if not a.is_confirmed]) + len([l for l in liabilities if not l.is_confirmed])
    
    pending_acts = len([act for act in actions if act.status in ["pending", "in_progress"]])
    completed_acts = len([act for act in actions if act.status == "completed"])
    total_acts = len(actions)
    progress_pct = int((completed_acts / total_acts * 100)) if total_acts > 0 else 0
    
    return {
        "estate_id": estate.id,
        "title": estate.title,
        "deceased_name": estate.deceased_name,
        "total_asset_value": total_assets,
        "total_liability_value": total_liabilities,
        "net_estate_value": total_assets - total_liabilities,
        "unconfirmed_items_count": unconfirmed,
        "pending_actions_count": pending_acts,
        "completed_actions_count": completed_acts,
        "total_actions_count": total_acts,
        "closure_progress_percent": progress_pct
    }
