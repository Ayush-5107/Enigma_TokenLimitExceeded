import os
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import UploadFile
from backend.app.core.config import settings
from backend.app.models.models import Document, ExtractionJob, EstateCase

class DocumentService:
    async def upload_document(self, db: Session, estate_id: str, title: str, file: UploadFile, user_id: str) -> Document:
        estate = db.query(EstateCase).filter(EstateCase.id == estate_id).first()
        if not estate:
            # Fallback create estate if none exists for convenience
            estate = EstateCase(id=estate_id, title="Deceased Estate Case", deceased_name="Late Family Member", primary_owner_id=user_id)
            db.add(estate)
            db.commit()

        file_title = title or file.filename
        file_path = os.path.join(settings.STORAGE_DIR, f"{estate_id}_{file.filename}")
        
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
            
        doc = Document(
            estate_id=estate_id,
            uploaded_by_id=user_id,
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
        return doc
        
    def get_document(self, db: Session, document_id: str) -> Optional[Document]:
        return db.query(Document).filter(Document.id == document_id).first()
        
    def get_document_status(self, db: Session, document_id: str) -> Optional[dict]:
        doc = self.get_document(db, document_id)
        if not doc:
            return None
        
        job = db.query(ExtractionJob).filter(ExtractionJob.document_id == document_id).order_by(ExtractionJob.created_at.desc()).first()
        return {
            "document_id": doc.id,
            "status": doc.status,
            "job_id": job.id if job else None,
            "job_status": job.status if job else "none",
            "confidence_score": job.confidence_score if job else 0.0
        }

document_service = DocumentService()
