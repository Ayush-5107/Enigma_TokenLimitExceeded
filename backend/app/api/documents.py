import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User
from backend.app.schemas.schemas import DocumentResponse, ExtractionJobResponse
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event
from backend.app.services.document_service import document_service

router = APIRouter(prefix="", tags=["documents"])

@router.post("/documents", response_model=DocumentResponse)
async def upload_document(
    estate_id: str = Form(...),
    title: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = await document_service.upload_document(db, estate_id, title, file, current_user.id)
    log_audit_event(db, current_user, "UPLOAD_DOC", f"Uploaded financial document '{doc.title}' ({doc.file_size_bytes} bytes)", estate_id=estate_id)
    return doc

@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = document_service.get_document(db, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.get("/documents/{document_id}/status")
def get_document_status(document_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    status = document_service.get_document_status(db, document_id)
    if not status:
        raise HTTPException(status_code=404, detail="Document not found")
    return status
