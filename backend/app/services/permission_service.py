from sqlalchemy.orm import Session
from backend.app.models.models import User
from backend.app.security.permissions import verify_section_permission

class PermissionService:
    def check_access(self, db: Session, user: User, estate_id: str, section: str) -> bool:
        """
        Service layer wrapper to verify section permission.
        """
        return verify_section_permission(db, user, estate_id, section)

permission_service = PermissionService()
