from sqlalchemy.orm import Session
from backend.app.models.models import ExtractionJob
from extraction.ocr.parser import ocr_parser
from extraction.classification.classifier import classifier
from extraction.validation.validator import validator

class ExtractionService:
    def create_extraction_job(self, db: Session, document_id: str) -> ExtractionJob:
        job = ExtractionJob(document_id=document_id, status="queued")
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    def run_extraction(self, db: Session, job_id: str) -> ExtractionJob:
        job = db.query(ExtractionJob).filter(ExtractionJob.id == job_id).first()
        if not job:
            return None
        
        job.status = "processing_tee"
        db.commit()
        
        # 1. OCR & Layout
        ocr_result = ocr_parser.extract_text_and_layout("dummy_file_path")
        
        # 2. Classification
        doc_type = classifier.classify_document(ocr_result["raw_text"])
        
        # 3. Model Inference (mocked here)
        raw_extracted_fields = {"type": doc_type, "amount": 1000}
        
        # 4. Validation & Confidence
        validated_fields, confidence = validator.validate_and_score(raw_extracted_fields)
        
        job.extracted_data_json = validated_fields
        job.confidence_score = confidence
        job.status = "completed"
        db.commit()
        db.refresh(job)
        return job

    def confirm_extracted_data(self, db: Session, extraction_id: str, req_data: dict, current_user_id: str) -> dict:
        from backend.app.models.models import Asset, Liability, Document
        from backend.app.services.action_engine import ActionEngine
        
        job = db.query(ExtractionJob).filter(ExtractionJob.id == extraction_id).first()
        if not job:
            return None
            
        doc = db.query(Document).filter(Document.id == job.document_id).first()
        estate_id = doc.estate_id if doc else "default-estate-1"
        
        entity_type = req_data.get("entity_type")
        
        if entity_type == "liability":
            liability = Liability(
                estate_id=estate_id,
                document_id=doc.id if doc else None,
                category=req_data.get("category"),
                name=req_data.get("name"),
                creditor=req_data.get("institution_or_creditor"),
                total_amount=req_data.get("amount_or_value"),
                due_date=req_data.get("due_date") or "Next EMI billing cycle",
                is_confirmed=True,
                confidence_score=1.0,
                status="confirmed",
                details_json=req_data.get("confirmed_fields", {}),
                confirmed_by_id=current_user_id
            )
            db.add(liability)
            db.commit()
            db.refresh(liability)
            
            ActionEngine.generate_actions_for_liability(db, estate_id, liability)
            result_id = liability.id
            
        else: # Asset
            asset = Asset(
                estate_id=estate_id,
                document_id=doc.id if doc else None,
                category=req_data.get("category"),
                name=req_data.get("name"),
                institution=req_data.get("institution_or_creditor"),
                estimated_value=req_data.get("amount_or_value"),
                account_number_masked=req_data.get("account_or_ref_number") or "CONFIRMED-****",
                is_confirmed=True,
                confidence_score=1.0,
                status="confirmed",
                details_json=req_data.get("confirmed_fields", {}),
                confirmed_by_id=current_user_id
            )
            db.add(asset)
            db.commit()
            db.refresh(asset)
            
            ActionEngine.generate_actions_for_asset(db, estate_id, asset)
            result_id = asset.id

        if doc:
            doc.status = "confirmed"
            db.commit()
            
        return {
            "entity_id": result_id,
            "entity_type": entity_type,
            "estate_id": estate_id,
            "amount_or_value": req_data.get("amount_or_value"),
            "name": req_data.get("name")
        }

extraction_service = ExtractionService()
