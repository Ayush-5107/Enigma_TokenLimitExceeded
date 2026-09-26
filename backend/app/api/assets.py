from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, Asset
from backend.app.schemas.schemas import AssetCreate, AssetResponse
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event
from backend.app.services.action_engine import ActionEngine

router = APIRouter(prefix="", tags=["assets"])

@router.get("/estate/{estate_id}/assets", response_model=List[AssetResponse])
def list_assets(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Asset).filter(Asset.estate_id == estate_id).all()

@router.post("/estate/{estate_id}/assets", response_model=AssetResponse)
def create_asset(estate_id: str, asset_in: AssetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    asset = Asset(
        estate_id=estate_id,
        category=asset_in.category,
        name=asset_in.name,
        institution=asset_in.institution,
        estimated_value=asset_in.estimated_value,
        account_number_masked=asset_in.account_number_masked,
        is_confirmed=True,
        confidence_score=1.0,
        status="confirmed",
        details_json=asset_in.details_json or {},
        confirmed_by_id=current_user.id
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    
    ActionEngine.generate_actions_for_asset(db, estate_id, asset)
    log_audit_event(db, current_user, "CREATE_ASSET", f"Added confirmed asset '{asset.name}' (${asset.estimated_value:,.2f})", estate_id=estate_id)
    return asset

@router.put("/estate/{estate_id}/assets/{asset_id}", response_model=AssetResponse)
def update_asset(estate_id: str, asset_id: str, asset_in: AssetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.estate_id == estate_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    asset.name = asset_in.name
    asset.category = asset_in.category
    asset.institution = asset_in.institution
    asset.estimated_value = asset_in.estimated_value
    asset.account_number_masked = asset_in.account_number_masked
    if asset_in.details_json:
        asset.details_json = asset_in.details_json
    asset.is_confirmed = True
    asset.status = "confirmed"
    db.commit()
    db.refresh(asset)
    log_audit_event(db, current_user, "UPDATE_ASSET", f"Updated asset '{asset.name}'", estate_id=estate_id)
    return asset
