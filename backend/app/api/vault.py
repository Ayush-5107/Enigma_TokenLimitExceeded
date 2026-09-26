from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User
from backend.app.schemas.schemas import VaultEntryCreate, VaultEntryResponse
from backend.app.security.auth import get_current_user
from backend.app.security.encryption import decrypt_data
from backend.app.security.audit import log_audit_event
from backend.app.services.vault_service import vault_service

router = APIRouter(prefix="/vault", tags=["vault"])

@router.get("/entries", response_model=List[VaultEntryResponse])
def list_vault_entries(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entries = vault_service.get_vault_entries(db, current_user.id)
    res = []
    for entry in entries:
        decrypted = decrypt_data(entry.encrypted_content)
        entry_resp = VaultEntryResponse(
            id=entry.id,
            owner_id=entry.owner_id,
            title=entry.title,
            category=entry.category,
            institution=entry.institution,
            access_level=entry.access_level,
            deadman_trigger_days=entry.deadman_trigger_days,
            metadata_json=entry.metadata_json or {},
            content=decrypted,
            created_at=entry.created_at,
            updated_at=entry.updated_at
        )
        res.append(entry_resp)
    log_audit_event(db, current_user, "VIEW_VAULT", f"User viewed {len(entries)} vault entries")
    return res

@router.post("/entries", response_model=VaultEntryResponse)
def create_vault_entry(entry_in: VaultEntryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    data = {
        "title": entry_in.title,
        "category": entry_in.category,
        "content": entry_in.content,
        "institution": entry_in.institution,
        "access_level": entry_in.access_level or "private",
        "deadman_trigger_days": entry_in.deadman_trigger_days or 30,
        "metadata_json": entry_in.metadata or {}
    }
    
    entry = vault_service.create_vault_entry(db, data, current_user.id)
    log_audit_event(db, current_user, "CREATE_VAULT_ENTRY", f"Created vault item '{entry.title}' category {entry.category}")
    
    return VaultEntryResponse(
        id=entry.id,
        owner_id=entry.owner_id,
        title=entry.title,
        category=entry.category,
        institution=entry.institution,
        access_level=entry.access_level,
        deadman_trigger_days=entry.deadman_trigger_days,
        metadata_json=entry.metadata_json or {},
        content=entry_in.content,
        created_at=entry.created_at,
        updated_at=entry.updated_at
    )

@router.delete("/entries/{entry_id}")
def delete_vault_entry(entry_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    success = vault_service.delete_vault_entry(db, entry_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Vault entry not found")
        
    log_audit_event(db, current_user, "DELETE_VAULT_ENTRY", f"Deleted vault entry ID {entry_id}")
    return {"status": "success", "message": "Vault entry deleted"}
