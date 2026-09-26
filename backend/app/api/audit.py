from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, AuditEvent, Notification
from backend.app.schemas.schemas import AuditEventResponse, NotificationResponse
from backend.app.security.auth import get_current_user

router = APIRouter(prefix="", tags=["audit_notifications"])

@router.get("/estate/{estate_id}/audit", response_model=List[AuditEventResponse])
def get_estate_audit_trail(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    events = db.query(AuditEvent).filter(
        (AuditEvent.estate_id == estate_id) | (AuditEvent.estate_id == None)
    ).order_by(AuditEvent.timestamp.desc()).limit(100).all()
    return events

@router.get("/notifications", response_model=List[NotificationResponse])
def get_user_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()

@router.put("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}
