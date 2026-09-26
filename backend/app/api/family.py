from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, EstateMember
from backend.app.schemas.schemas import FamilyMemberCreate, FamilyMemberResponse, PermissionUpdateRequest
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event

router = APIRouter(prefix="", tags=["family"])

@router.get("/estate/{estate_id}/members", response_model=List[FamilyMemberResponse])
def list_estate_members(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(EstateMember).filter(EstateMember.estate_id == estate_id).all()

@router.post("/estate/{estate_id}/members", response_model=FamilyMemberResponse)
def add_estate_member(estate_id: str, member_in: FamilyMemberCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(EstateMember).filter(EstateMember.estate_id == estate_id, EstateMember.email == member_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Member email already invited to this estate")
        
    member = EstateMember(
        estate_id=estate_id,
        name=member_in.name,
        email=member_in.email,
        relationship_type=member_in.relationship_type,
        role=member_in.role or "family_member",
        permissions_json=member_in.permissions or {
            "vault": False,
            "documents": True,
            "estate": True,
            "actions": True,
            "audit": False
        },
        status="active"
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    
    log_audit_event(db, current_user, "ADD_FAMILY_MEMBER", f"Added family member {member.name} ({member.relationship_type}) to estate", estate_id=estate_id)
    return member

@router.put("/members/{member_id}/permissions")
def update_member_permissions(member_id: str, req: PermissionUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    member = db.query(EstateMember).filter(EstateMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    member.permissions_json = req.permissions
    db.commit()
    
    log_audit_event(db, current_user, "UPDATE_PERMISSIONS", f"Updated section access permissions for {member.name}", estate_id=member.estate_id)
    return {"status": "success", "member_id": member.id, "permissions": member.permissions_json}
