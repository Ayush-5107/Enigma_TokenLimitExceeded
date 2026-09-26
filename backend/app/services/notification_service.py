from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.models.models import Notification

class NotificationService:
    def get_user_notifications(self, db: Session, user_id: str) -> List[Notification]:
        return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

    def mark_as_read(self, db: Session, notification_id: str, user_id: str) -> bool:
        notif = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == user_id).first()
        if notif:
            notif.is_read = True
            db.commit()
            return True
        return False

notification_service = NotificationService()
