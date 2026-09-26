from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User
from backend.app.schemas.schemas import FamilyMemberCreate, FamilyMemberResponse, PermissionUpdateRequest
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event
from backend.app.services.family_service import family_service

router = APIRouter(prefix="", tags=["family"])

@router.get("/estate/{estate_id}/members", response_model=List[FamilyMemberResponse])
def list_estate_members(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return family_service.get_members(db, estate_id)

@router.post("/estate/{estate_id}/members", response_model=FamilyMemberResponse)
def add_estate_member(estate_id: str, member_in: FamilyMemberCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = family_service.get_member_by_email(db, estate_id, member_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Member email already invited to this estate")
        
    data = {
        "name": member_in.name,
        "email": member_in.email,
        "relationship_type": member_in.relationship_type,
        "role": member_in.role,
        "permissions": member_in.permissions
    }
    
    member = family_service.add_member(db, estate_id, data)
    
    log_audit_event(db, current_user, "ADD_FAMILY_MEMBER", f"Added family member {member.name} ({member.relationship_type}) to estate", estate_id=estate_id)
    return member

@router.put("/members/{member_id}/permissions")
def update_member_permissions(member_id: str, req: PermissionUpdateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    member = family_service.update_permissions(db, member_id, req.permissions)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    log_audit_event(db, current_user, "UPDATE_PERMISSIONS", f"Updated section access permissions for {member.name}", estate_id=member.estate_id)
    return {"status": "success", "member_id": member.id, "permissions": member.permissions_json}
