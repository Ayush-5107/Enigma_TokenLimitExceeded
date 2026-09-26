from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.models.models import VaultEntry

class VaultRepository:
    def create(self, db: Session, obj_in: dict, owner_id: str) -> VaultEntry:
        db_obj = VaultEntry(
            owner_id=owner_id,
            title=obj_in.get("title"),
            category=obj_in.get("category"),
            encrypted_content=obj_in.get("encrypted_content"),
            institution=obj_in.get("institution"),
            access_level=obj_in.get("access_level", "private"),
            deadman_trigger_days=obj_in.get("deadman_trigger_days", 30),
            metadata_json=obj_in.get("metadata_json", {})
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_id(self, db: Session, entry_id: str) -> Optional[VaultEntry]:
        return db.query(VaultEntry).filter(VaultEntry.id == entry_id).first()

    def get_all_for_user(self, db: Session, owner_id: str) -> List[VaultEntry]:
        return db.query(VaultEntry).filter(VaultEntry.owner_id == owner_id).all()

    def update(self, db: Session, db_obj: VaultEntry, obj_in: dict) -> VaultEntry:
        update_data = obj_in
        for field in ["title", "category", "encrypted_content", "institution", "access_level", "deadman_trigger_days", "metadata_json"]:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, entry_id: str) -> bool:
        obj = self.get_by_id(db, entry_id)
        if obj:
            db.delete(obj)
            db.commit()
            return True
        return False

vault_repo = VaultRepository()
