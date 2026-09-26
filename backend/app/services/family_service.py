from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from backend.app.models.models import EstateMember

class FamilyService:
    def get_members(self, db: Session, estate_id: str) -> List[EstateMember]:
        return db.query(EstateMember).filter(EstateMember.estate_id == estate_id).all()

    def get_member_by_email(self, db: Session, estate_id: str, email: str) -> Optional[EstateMember]:
        return db.query(EstateMember).filter(EstateMember.estate_id == estate_id, EstateMember.email == email).first()

    def get_member_by_id(self, db: Session, member_id: str) -> Optional[EstateMember]:
        return db.query(EstateMember).filter(EstateMember.id == member_id).first()

    def add_member(self, db: Session, estate_id: str, data: dict) -> EstateMember:
        member = EstateMember(
            estate_id=estate_id,
            name=data["name"],
            email=data["email"],
            relationship_type=data["relationship_type"],
            role=data.get("role", "family_member"),
            permissions_json=data.get("permissions") or {
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
        return member

    def update_permissions(self, db: Session, member_id: str, permissions: dict) -> Optional[EstateMember]:
        member = self.get_member_by_id(db, member_id)
        if not member:
            return None
        
        member.permissions_json = permissions
        db.commit()
        db.refresh(member)
        return member

family_service = FamilyService()
