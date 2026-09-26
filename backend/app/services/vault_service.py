from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from backend.app.repositories.vault_repository import vault_repo
from backend.app.models.models import VaultEntry
from backend.app.security.encryption import encrypt_data, decrypt_data

class VaultService:
    def create_vault_entry(self, db: Session, data: dict, user_id: str) -> VaultEntry:
        # Encrypt the content before saving if necessary
        content = data.get("content", "")
        if content:
            # Placeholder for actual encryption logic:
            data["encrypted_content"] = encrypt_data(content)
        
        return vault_repo.create(db, data, owner_id=user_id)

    def get_vault_entries(self, db: Session, user_id: str) -> List[VaultEntry]:
        return vault_repo.get_all_for_user(db, user_id)

    def get_vault_entry(self, db: Session, entry_id: str, user_id: str) -> Optional[VaultEntry]:
        entry = vault_repo.get_by_id(db, entry_id)
        if not entry or entry.owner_id != user_id:
            return None
        return entry

    def update_vault_entry(self, db: Session, entry_id: str, data: dict, user_id: str) -> Optional[VaultEntry]:
        entry = self.get_vault_entry(db, entry_id, user_id)
        if not entry:
            return None
            
        content = data.get("content")
        if content is not None:
            data["encrypted_content"] = encrypt_data(content)
            
        return vault_repo.update(db, entry, data)

    def delete_vault_entry(self, db: Session, entry_id: str, user_id: str) -> bool:
        entry = self.get_vault_entry(db, entry_id, user_id)
        if not entry:
            return False
        return vault_repo.delete(db, entry_id)

vault_service = VaultService()
