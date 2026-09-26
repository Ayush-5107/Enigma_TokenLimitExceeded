from sqlalchemy.orm import Session
from typing import List
from backend.app.models.models import AuditEvent

class AuditService:
    def get_estate_audit_trail(self, db: Session, estate_id: str) -> List[AuditEvent]:
        return db.query(AuditEvent).filter(
            (AuditEvent.estate_id == estate_id) | (AuditEvent.estate_id == None)
        ).order_by(AuditEvent.timestamp.desc()).limit(100).all()

audit_service = AuditService()
