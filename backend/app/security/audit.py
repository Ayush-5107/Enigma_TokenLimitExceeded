from sqlalchemy.orm import Session
from backend.app.models.models import AuditEvent, User
from typing import Optional

def log_audit_event(
    db: Session,
    user: Optional[User],
    action_type: str,
    description: str,
    estate_id: Optional[str] = None,
    target_resource: Optional[str] = None,
    user_name_override: Optional[str] = None
):
    user_name = user_name_override or (user.full_name if user else "System")
    user_id = user.id if user else None
    
    event = AuditEvent(
        estate_id=estate_id,
        user_id=user_id,
        user_name=user_name,
        action_type=action_type,
        description=description,
        target_resource=target_resource,
        ip_address="127.0.0.1"
    )
    db.add(event)
    db.commit()
    return event
