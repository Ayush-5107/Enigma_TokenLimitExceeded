from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from backend.app.models.models import User, EstateMember, EstateCase

def verify_section_permission(db: Session, user: User, estate_id: str, section: str) -> bool:
    """
    Enforces section-level least privilege access (vault, documents, estate, actions, audit)
    Primary owner always has full access. Family members check explicit permissions_json.
    """
    estate = db.query(EstateCase).filter(EstateCase.id == estate_id).first()
    if not estate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estate case not found")
        
    if estate.primary_owner_id == user.id or user.role == "owner":
        return True
        
    member = db.query(EstateMember).filter(
        EstateMember.estate_id == estate_id,
        (EstateMember.user_id == user.id) | (EstateMember.email == user.email)
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: User is not a member of estate {estate_id}"
        )
        
    perms = member.permissions_json or {}
    if not perms.get(section, False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: Restricted section '{section}' for your family role"
        )
        
    return True
