from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, ActionItem, EstateMember, TaskEvidence
from backend.app.schemas.schemas import ActionItemCreate, ActionItemResponse, ActionAssignRequest, TaskStatusUpdate
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event

router = APIRouter(prefix="", tags=["actions"])

@router.get("/estate/{estate_id}/actions", response_model=List[ActionItemResponse])
def list_actions(estate_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    actions = db.query(ActionItem).filter(ActionItem.estate_id == estate_id).all()
    # Sort by urgency score descending
    return sorted(actions, key=lambda x: x.urgency_score, reverse=True)

@router.post("/estate/{estate_id}/actions", response_model=ActionItemResponse)
def create_action(estate_id: str, act_in: ActionItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    action = ActionItem(
        estate_id=estate_id,
        title=act_in.title,
        description=act_in.description,
        category=act_in.category,
        priority=act_in.priority,
        urgency_score=act_in.urgency_score,
        priority_reason=act_in.priority_reason,
        due_date=act_in.due_date,
        required_documents_json=act_in.required_documents_json or [],
        checklist_steps_json=act_in.checklist_steps_json or []
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    log_audit_event(db, current_user, "CREATE_ACTION", f"Created manual action item '{action.title}'", estate_id=estate_id)
    return action

@router.put("/estate/{estate_id}/actions/{action_id}", response_model=ActionItemResponse)
def update_action(estate_id: str, action_id: str, act_in: ActionItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    action = db.query(ActionItem).filter(ActionItem.id == action_id, ActionItem.estate_id == estate_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action item not found")
        
    action.title = act_in.title
    action.description = act_in.description
    action.priority = act_in.priority
    action.urgency_score = act_in.urgency_score
    action.priority_reason = act_in.priority_reason
    action.due_date = act_in.due_date
    db.commit()
    db.refresh(action)
    return action

@router.post("/actions/{action_id}/assign")
def assign_action(action_id: str, req: ActionAssignRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    action = db.query(ActionItem).filter(ActionItem.id == action_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action item not found")
        
    member = db.query(EstateMember).filter(EstateMember.id == req.member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Family member not found")
        
    action.assigned_member_id = member.id
    action.assigned_member_name = member.name
    if action.status == "pending":
        action.status = "in_progress"
    db.commit()
    
    log_audit_event(db, current_user, "ASSIGN_TASK", f"Assigned task '{action.title}' to family member {member.name}", estate_id=action.estate_id)
    return {"status": "success", "message": f"Action assigned to {member.name}", "action_id": action.id}

@router.put("/tasks/{task_id}/status")
def update_task_status(task_id: str, req: TaskStatusUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    action = db.query(ActionItem).filter(ActionItem.id == task_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Task not found")
        
    action.status = req.status
    db.commit()
    
    if req.note:
        evidence = TaskEvidence(
            action_id=action.id,
            uploaded_by_id=current_user.id,
            uploaded_by_name=current_user.full_name,
            note=req.note
        )
        db.add(evidence)
        db.commit()

    log_audit_event(db, current_user, "UPDATE_TASK_STATUS", f"Task '{action.title}' status updated to {req.status}", estate_id=action.estate_id)
    return {"status": "success", "task_id": action.id, "new_status": action.status}
