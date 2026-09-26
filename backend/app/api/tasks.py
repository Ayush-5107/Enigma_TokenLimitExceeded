from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User
from backend.app.security.auth import get_current_user
from backend.app.services.task_service import task_service

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("")
def get_user_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = task_service.get_tasks_for_user(db, current_user.id)
    return tasks

@router.put("/{task_id}/status")
def update_task_status(task_id: str, status: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = task_service.update_task_status(db, task_id, status)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"status": "success", "task_id": task.id, "new_status": task.status}
