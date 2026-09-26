from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User
from backend.app.schemas.schemas import NotificationResponse
from backend.app.security.auth import get_current_user
from backend.app.services.notification_service import notification_service

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("", response_model=List[NotificationResponse])
def get_user_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return notification_service.get_user_notifications(db, current_user.id)

@router.put("/{notification_id}/read")
def mark_notification_read(notification_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notification_service.mark_as_read(db, notification_id, current_user.id)
    return {"status": "success"}
