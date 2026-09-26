from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, Document, ExtractionJob, Asset, Liability, EstateCase
from backend.app.schemas.schemas import ExtractionJobCreate, ExtractionJobResponse, ExtractionConfirmRequest
from backend.app.security.auth import get_current_user
from backend.app.security.audit import log_audit_event
from backend.app.services.action_engine import ActionEngine
from tee.worker.worker import TEEProcessingWorker

router = APIRouter(prefix="/extraction", tags=["extraction"])

tee_worker = TEEProcessingWorker()

@router.post("/jobs", response_model=ExtractionJobResponse)
def create_extraction_job(req: ExtractionJobCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == req.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc.status = "processing_tee"
    db.commit()
    
    # Process document in TEE worker
    res = tee_worker.process_document(doc.title, doc.file_path)
    
    job = ExtractionJob(
        document_id=doc.id,
        status="completed",
        tee_enclave_id=res["tee_enclave_id"],
        tee_attestation_quote=res["attestation_quote"],
        extracted_data_json=res["extracted_data"],
        confidence_score=res["confidence_score"],
        low_confidence_fields_json=res["low_confidence_fields"],
        source_regions_json=res["source_regions"],
        completed_at=datetime.utcnow()
    )
    db.add(job)
    
    doc.status = "extracted"
    db.commit()
    db.refresh(job)
    
    log_audit_event(
        db, current_user, "TEE_EXTRACT", 
        f"Protected TEE OCR extraction completed for '{doc.title}'. Confidence: {job.confidence_score*100:.1f}%. Enclave: {job.tee_enclave_id}",
        estate_id=doc.estate_id
    )
    
    return job

@router.get("/jobs/{job_id}", response_model=ExtractionJobResponse)
def get_extraction_job(job_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(ExtractionJob).filter(ExtractionJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Extraction job not found")
    return job

@router.post("/{extraction_id}/confirm")
def confirm_extracted_data(extraction_id: str, req: ExtractionConfirmRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(ExtractionJob).filter(ExtractionJob.id == extraction_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Extraction job not found")
        
    doc = db.query(Document).filter(Document.id == job.document_id).first()
    estate_id = doc.estate_id if doc else "default-estate-1"

    if req.entity_type == "liability":
        liability = Liability(
            estate_id=estate_id,
            document_id=doc.id if doc else None,
            category=req.category,
            name=req.name,
            creditor=req.institution_or_creditor,
            total_amount=req.amount_or_value,
            due_date=req.due_date or "Next EMI billing cycle",
            is_confirmed=True,
            confidence_score=1.0,
            status="confirmed",
            details_json=req.confirmed_fields,
            confirmed_by_id=current_user.id
        )
        db.add(liability)
        db.commit()
        db.refresh(liability)
        
        # Trigger Action Engine to auto-generate closure actions & explainable priority
        ActionEngine.generate_actions_for_liability(db, estate_id, liability)
        result_id = liability.id
        
    else: # Asset
        asset = Asset(
            estate_id=estate_id,
            document_id=doc.id if doc else None,
            category=req.category,
            name=req.name,
            institution=req.institution_or_creditor,
            estimated_value=req.amount_or_value,
            account_number_masked=req.account_or_ref_number or "CONFIRMED-****",
            is_confirmed=True,
            confidence_score=1.0,
            status="confirmed",
            details_json=req.confirmed_fields,
            confirmed_by_id=current_user.id
        )
        db.add(asset)
        db.commit()
        db.refresh(asset)
        
        # Trigger Action Engine
        ActionEngine.generate_actions_for_asset(db, estate_id, asset)
        result_id = asset.id

    if doc:
        doc.status = "confirmed"
        db.commit()
        
    log_audit_event(
        db, current_user, "CONFIRM_DATA",
        f"Human confirmed extracted {req.entity_type} '{req.name}' (${req.amount_or_value:,.2f}). Promoted to Estate Inventory.",
        estate_id=estate_id
    )
    
    return {
        "status": "success",
        "message": f"Extracted {req.entity_type} confirmed and added to estate inventory!",
        "entity_id": result_id,
        "entity_type": req.entity_type
    }
