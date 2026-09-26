import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.config import settings
from backend.app.models.models import User, Document, ExtractionJob, EstateCase
from backend.app.schemas.schemas import DocumentResponse, ExtractionJobResponse
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event
from tee.worker.worker import TEEProcessingWorker

router = APIRouter(prefix="", tags=["documents"])

@router.post("/documents", response_model=DocumentResponse)
async def upload_document(
    estate_id: str = Form(...),
    title: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    estate = db.query(EstateCase).filter(EstateCase.id == estate_id).first()
    if not estate:
        # Fallback create estate if none exists for convenience
        estate = EstateCase(id=estate_id, title="Deceased Estate Case", deceased_name="Late Family Member", primary_owner_id=current_user.id)
        db.add(estate)
        db.commit()

    file_title = title or file.filename
    file_path = os.path.join(settings.STORAGE_DIR, f"{estate_id}_{file.filename}")
    
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
        
    doc = Document(
        estate_id=estate_id,
        uploaded_by_id=current_user.id,
        title=file_title,
        filename=file.filename,
        file_type=file.content_type or "application/pdf",
        file_path=file_path,
        file_size_bytes=len(contents),
        status="uploaded"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    log_audit_event(db, current_user, "UPLOAD_DOC", f"Uploaded financial document '{doc.title}' ({doc.file_size_bytes} bytes)", estate_id=estate_id)
    return doc

@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.get("/documents/{document_id}/status")
def get_document_status(document_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    job = db.query(ExtractionJob).filter(ExtractionJob.document_id == document_id).order_by(ExtractionJob.created_at.desc()).first()
    return {
        "document_id": doc.id,
        "status": doc.status,
        "job_id": job.id if job else None,
        "job_status": job.status if job else "none",
        "confidence_score": job.confidence_score if job else 0.0
    }
