from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.models.models import ActionItem

class TaskService:
    def get_tasks_for_user(self, db: Session, user_id: str) -> List[ActionItem]:
        # Placeholder for returning tasks assigned to the current user's estate member profiles
        return db.query(ActionItem).filter(ActionItem.status != "completed").all()

    def update_task_status(self, db: Session, task_id: str, status: str) -> Optional[ActionItem]:
        task = db.query(ActionItem).filter(ActionItem.id == task_id).first()
        if not task:
            return None
        task.status = status
        db.commit()
        db.refresh(task)
        return task

task_service = TaskService()
