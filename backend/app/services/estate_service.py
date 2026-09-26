from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from backend.app.models.models import EstateCase, Asset, Liability, ActionItem, EstateMember, User
from backend.app.schemas.schemas import EstateCaseCreate

class EstateService:
    def create_estate(self, db: Session, case_in: EstateCaseCreate, current_user: User) -> EstateCase:
        estate = EstateCase(
            title=case_in.title,
            deceased_name=case_in.deceased_name,
            date_of_passing=case_in.date_of_passing,
            primary_owner_id=current_user.id
        )
        db.add(estate)
        db.commit()
        db.refresh(estate)
        
        # Auto add owner as primary member
        owner_member = EstateMember(
            estate_id=estate.id,
            user_id=current_user.id,
            name=current_user.full_name,
            email=current_user.email,
            relationship_type="Owner / Executor",
            role="owner",
            permissions_json={"vault": True, "documents": True, "estate": True, "actions": True, "audit": True},
            status="active"
        )
        db.add(owner_member)
        db.commit()
        
        return estate

    def get_estate(self, db: Session, estate_id: str) -> Optional[EstateCase]:
        return db.query(EstateCase).filter(EstateCase.id == estate_id).first()

    def get_estate_summary(self, db: Session, estate: EstateCase) -> Dict[str, Any]:
        assets = db.query(Asset).filter(Asset.estate_id == estate.id).all()
        liabilities = db.query(Liability).filter(Liability.estate_id == estate.id).all()
        actions = db.query(ActionItem).filter(ActionItem.estate_id == estate.id).all()
        
        total_assets = sum(a.estimated_value for a in assets)
        total_liabilities = sum(l.total_amount for l in liabilities)
        unconfirmed = len([a for a in assets if not a.is_confirmed]) + len([l for l in liabilities if not l.is_confirmed])
        
        pending_acts = len([act for act in actions if act.status in ["pending", "in_progress"]])
        completed_acts = len([act for act in actions if act.status == "completed"])
        total_acts = len(actions)
        progress_pct = int((completed_acts / total_acts * 100)) if total_acts > 0 else 0
        
        return {
            "estate_id": estate.id,
            "title": estate.title,
            "deceased_name": estate.deceased_name,
            "total_asset_value": total_assets,
            "total_liability_value": total_liabilities,
            "net_estate_value": total_assets - total_liabilities,
            "unconfirmed_items_count": unconfirmed,
            "pending_actions_count": pending_acts,
            "completed_actions_count": completed_acts,
            "total_actions_count": total_acts,
            "closure_progress_percent": progress_pct
        }

estate_service = EstateService()
